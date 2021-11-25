import React from "react";
import type { TmpEffectContainer } from "../effect-decorator/effect-decorator";
import { GenericHookFacade } from "../generic-hook-facade/generic-hook-facade";
import { StateFacade } from "../state-facade/state-facade";

export abstract class ReactiveClass<P extends React.PropsWithChildren<any>> {
  private _original: ReactiveClass<P>;

  private _hooks: (
    | GenericHookFacade<unknown[], unknown>
    | StateFacade<unknown>
  )[] = [];

  private _effects: [
    callback: () => void | (() => void),
    deps: (c: ReactiveClass<any>) => any[]
  ][] = [];

  private _props: P = {} as any;

  private _addHook(
    store: GenericHookFacade<unknown[], unknown> | StateFacade<unknown>
  ) {
    this._hooks.push(store);
  }

  private _addEffect(effect: TmpEffectContainer) {
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

  private _deproxify() {
    return this._original;
  }

  private _setProps(props: P) {
    this._props = props;
  }

  constructor(props: P) {
    this._original = this;
    this._setProps(props);

    const proxy = new Proxy(this, {
      set(target, key, value) {
        if (StateFacade.isStateFacade(value)) {
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
          target._addHook(value);

          Object.defineProperty(target, key, {
            set() {
              throw new Error("Hook's cannot be overwritten.");
            },
            get() {
              if (value.isInitiated()) return value.get();
              throw new Error("Hooks cannot be accessed in the constructor.");
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

  getProps(): P {
    return this._props;
  }

  abstract render(props: P): JSX.Element;
}
