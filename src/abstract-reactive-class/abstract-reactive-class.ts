import type React from "react";
import { StateFacade } from "../state-facade/state-facade";

export abstract class ReactiveClass<P extends React.PropsWithChildren<any>> {
  private _original: ReactiveClass<P>;

  private _stateFacades: StateFacade<unknown>[] = [];

  private _addState(store: StateFacade<unknown>) {
    this._stateFacades.push(store);
  }

  private _useStates() {
    for (const facade of this._stateFacades) {
      facade.use();
    }
  }

  private _deproxify() {
    return this._original;
  }

  constructor() {
    this._original = this;

    const proxy = new Proxy(this, {
      set(target, key, value) {
        if (StateFacade.isStateFacade(value)) {
          target._addState(value);

          Object.defineProperty(target, key, {
            set(v) {
              value.set(v);
              return true;
            },
            get() {
              return value.get();
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

  abstract render(props: P): JSX.Element;
}
