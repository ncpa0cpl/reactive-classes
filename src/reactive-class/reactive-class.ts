import type { DependencyResolver } from "../effect-decorator/effect-wrapper";
import { EffectWrapper } from "../effect-decorator/effect-wrapper";
import { GenericHookWrapper } from "../generic-hook-wrapper/generic-hook-wrapper";
import { MetadataKeys } from "../metadata";
import { StateWrapper } from "../state-wrapper/state-wrapper";
import { bindClassMethods } from "../utils/bind-class-methods";
import { isObject } from "../utils/is-object";

const IS_REACTIVE_CLASS = Symbol("is-reactive-class");

export abstract class ReactiveClass {
  private readonly [IS_REACTIVE_CLASS] = true;
  static isReactiveClass(v: any): v is ReactiveClass {
    return isObject(v) && IS_REACTIVE_CLASS in v;
  }

  private _original: ReactiveClass;

  private _parentClass?: ReactiveClass;

  private _hooks: (
    | GenericHookWrapper<unknown[], unknown>
    | StateWrapper<unknown>
  )[] = [];

  private _effects: EffectWrapper[] = [];

  /**
   * Add the hook wrapper to the parent hook list if a parent
   * exists, or to self instance otherwise.
   */
  private _addHook(
    hook: GenericHookWrapper<unknown[], unknown> | StateWrapper<unknown>
  ): void {
    if (this._parentClass) {
      return this._parentClass._addHook(hook);
    }
    this._hooks.push(hook);
  }

  /**
   * Add the effect wrapper to the parent hook list if a parent
   * exists, or to self instance otherwise.
   */
  private _addEffect(effect: EffectWrapper): void {
    if (this._parentClass) {
      return this._parentClass._addEffect(effect);
    }
    this._effects.push(effect);
  }

  /** Invoke all of the hooks added to this instance and it's child's. */
  private _useHooks() {
    for (const hook of this._hooks) {
      hook.use();
    }
  }

  /** Invoke all of the effects added to this instance and it's child's. */
  private _useEffects() {
    for (const effect of this._effects) {
      effect.use();
    }
  }

  /**
   * Define a parent of this instance and move all effects and
   * hook wrappers to the parent.
   */
  private _setParent(parent: ReactiveClass) {
    this._original._parentClass = parent;

    for (const hook of this._original._hooks.splice(0)) {
      parent._addHook(hook);
    }

    for (const effect of this._original._effects.splice(0)) {
      parent._addEffect(effect);
    }
  }

  /**
   * Return the original instance of this, without the proxy
   * that's wrapped around it.
   */
  private _deproxify<T extends ReactiveClass>(this: T): T {
    return this._original as T;
  }

  /**
   * Find all the methods of this instance tagged as effects, and
   * add them to the effect's list.
   */
  private _registerEffects() {
    let proto = Object.getPrototypeOf(this._original);

    while (proto && proto !== ReactiveClass.prototype) {
      const methodNames = Object.getOwnPropertyNames(proto);

      for (const methodName of methodNames) {
        if (Reflect.hasMetadata(MetadataKeys.Effect, this, methodName)) {
          const dependencyResolver: DependencyResolver = Reflect.getMetadata(
            MetadataKeys.Effect,
            this,
            methodName
          );

          this._addEffect(
            new EffectWrapper(
              this,
              // @ts-expect-error
              (origin) => origin[methodName](),
              (origin) => dependencyResolver(origin)
            )
          );
        }
      }

      try {
        proto = Object.getPrototypeOf(proto);
      } catch {
        proto = undefined;
      }
    }
  }

  /** Bind all of the methods of this instance. */
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

  /** Register a new useState hook to this instance or it's parent. */
  private _registerState(key: string | symbol, state: StateWrapper<unknown>) {
    state.use();

    this._original._addHook(state);

    Object.defineProperty(this._original, key, {
      set(v) {
        state.set(v);
        return true;
      },
      get() {
        return state.get();
      },
    });
  }

  /** Register a new hook to this instance or it's parent. */
  private _registerHook(
    key: string | symbol,
    hook: GenericHookWrapper<unknown[], unknown>
  ) {
    hook.use();

    this._original._addHook(hook);

    Object.defineProperty(this._original, key, {
      set() {
        throw new Error("Hook's cannot be overwritten.");
      },
      get() {
        return hook.get();
      },
    });
  }

  /** Register a new ReactiveClass instance as this child. */
  private _registerChildReactiveClass(
    key: string | symbol,
    child: ReactiveClass
  ) {
    child._setParent(this._original);

    Object.defineProperty(this._original, key, {
      set() {
        throw new Error("Hook's cannot be overwritten.");
      },
      get() {
        return child._original;
      },
    });
  }

  constructor(beforeInit?: (self: any) => void) {
    if (beforeInit) {
      beforeInit(this);
    }

    this._original = this;

    this._registerEffects();
    this._bindMethods();

    const proxy = new Proxy(this, {
      set(target, key, value) {
        if (StateWrapper.isStateWrapper(value)) {
          target._registerState(key, value);
        } else if (GenericHookWrapper.isHookWrapper(value)) {
          target._registerHook(key, value);
        } else if (ReactiveClass.isReactiveClass(value)) {
          target._registerChildReactiveClass(key, value);
        } else {
          Object.defineProperty(target, key, { value });
        }

        return true;
      },
    });

    return proxy;
  }
}
