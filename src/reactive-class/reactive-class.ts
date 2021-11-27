import lodash from "lodash";
import { EffectFacade } from "../effect-decorator/effect-decorator";
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

  private _effects: EffectFacade[] = [];

  private _addHook(
    hook: GenericHookFacade<unknown[], unknown> | StateFacade<unknown>
  ): void {
    if (this._parentClass) {
      return this._parentClass._addHook(hook);
    }
    this._hooks.push(hook);
  }

  private _addEffect(effect: EffectFacade): void {
    if (this._parentClass) {
      return this._parentClass._addEffect(effect);
    }
    this._effects.push(effect);
  }

  private _useHooks() {
    for (const hook of this._hooks) {
      hook.use();
    }
  }

  private _useEffects() {
    for (const effect of this._effects) {
      effect.use();
    }
  }

  private _hasEffect(name: string) {
    return this._effects.some((e) => e.isSameName(name));
  }

  private _setParent(parent: ReactiveClass) {
    this._original._parentClass = parent;

    for (const hook of this._original._hooks.splice(0)) {
      parent._addHook(hook);
    }

    for (const effect of this._original._effects.splice(0)) {
      parent._addEffect(effect);
    }
  }

  private _deproxify<T extends ReactiveClass>(this: T): T {
    return this._original as T;
  }

  private _registerEffects() {
    let proto = Object.getPrototypeOf(this._original);

    while (proto && proto !== ReactiveClass.prototype) {
      const methodNames = Object.getOwnPropertyNames(proto);

      for (const methodName of methodNames) {
        const v = lodash.get(proto, methodName);

        if (EffectFacade.isEffectFacade(v) && !this._hasEffect(v.name)) {
          this._addEffect(v.create(this._original));
        }
      }

      try {
        proto = Object.getPrototypeOf(proto);
      } catch {
        proto = undefined;
      }
    }
  }

  private _bindMethods() {
    let proto = Object.getPrototypeOf(this._original);

    while (proto && proto !== ReactiveClass.prototype) {
      bindClassMethods(this._original, proto);

      try {
        proto = Object.getPrototypeOf(proto);
      } catch {
        proto = undefined;
      }
    }
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
              return value._original;
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
