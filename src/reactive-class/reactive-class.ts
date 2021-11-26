import lodash from "lodash";
import React from "react";
import { TmpEffectContainer } from "../effect-decorator/effect-decorator";
import { GenericHookFacade } from "../generic-hook-facade/generic-hook-facade";
import { StateFacade } from "../state-facade/state-facade";
import { bindClassMethods } from "../utils/bind-class-methods";
import { isObject } from "../utils/is-object";

const REACTIVE_CLASS_SYMBOL = Symbol();

export abstract class ReactiveClass {
  static isReactiveClass(v: any): v is ReactiveClass {
    return (
      isObject(v) &&
      "_isReactiveClass" in v &&
      // @ts-expect-error
      v._isReactiveClass === REACTIVE_CLASS_SYMBOL
    );
  }

  private readonly _isReactiveClass = REACTIVE_CLASS_SYMBOL;

  private _original: ReactiveClass;

  private _parentClass?: ReactiveClass;

  private _hooks: (
    | GenericHookFacade<unknown[], unknown>
    | StateFacade<unknown>
  )[] = [];

  private _effects: [
    callback: () => void | (() => void),
    deps: (c: ReactiveClass) => any[]
  ][] = [];

  private _addHook(
    hook: GenericHookFacade<unknown[], unknown> | StateFacade<unknown>
  ): void {
    if (this._parentClass) {
      return this._parentClass._addHook(hook);
    }
    this._hooks.push(hook);
  }

  private _addEffect(effect: TmpEffectContainer): void {
    if (this._parentClass) {
      return this._parentClass._addEffect(effect);
    }
    this._effects.push([
      effect.implementation.bind(this),
      effect.dependencyResolver,
    ]);
  }

  private _useHooks() {
    for (const facade of this._hooks) {
      facade.use();
    }
  }

  private _useEffects() {
    for (const [impl, getDeps] of this._effects) {
      React.useEffect(impl, getDeps(this));
    }
  }

  private _setParent(parent: ReactiveClass) {
    this._parentClass = parent;

    for (const hook of this._hooks.splice(0)) {
      parent._addHook(hook);
    }

    for (const [impl, getDeps] of this._effects.splice(0)) {
      parent._addEffect(new TmpEffectContainer(impl, () => getDeps(this)));
    }
  }

  private _deproxify<T extends ReactiveClass>(this: T): T {
    return this._original as T;
  }

  private _registerEffects() {
    const methodList = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this._original)
    );

    for (const methodName of methodList) {
      const v = lodash.get(this, methodName);

      if (TmpEffectContainer.isEffectContainer(v)) {
        this["_addEffect"](v);
      }
    }
  }

  private _bindMethods() {
    bindClassMethods(this._original, Object.getPrototypeOf(this._original));
  }

  constructor(beforeInit?: (self: any) => void) {
    beforeInit ? beforeInit(this) : void 0;

    this._original = this;

    this._registerEffects();
    this._bindMethods();

    const proxy = new Proxy(this, {
      set(target, key, value) {
        if (StateFacade.isStateFacade(value)) {
          value.use();

          target._addHook(value);

          Object.defineProperty(target, key, {
            set(v) {
              value.set(v);
              return true;
            },
            get() {
              return value.get();
            },
          });
        } else if (GenericHookFacade.isHookFacade(value)) {
          value.use();

          target._addHook(value);

          Object.defineProperty(target, key, {
            set() {
              throw new Error("Hook's cannot be overwritten.");
            },
            get() {
              return value.get();
            },
          });
        } else if (ReactiveClass.isReactiveClass(value)) {
          value._setParent(target);
          Object.defineProperty(target, key, {
            set() {
              throw new Error("Hook's cannot be overwritten.");
            },
            get() {
              return value;
            },
          });
        } else {
          // @ts-ignore
          target[key] = value;
        }

        return true;
      },
    });

    return proxy;
  }
}
