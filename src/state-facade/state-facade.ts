import lodash from "lodash";
import Observable from "observable-slim";
import React from "react";
import { isObject } from "../utils/is-object";

type SetArg<T> = React.Dispatch<React.SetStateAction<T>>;

const STATE_STORE_SYMBOL = Symbol();

export class StateFacade<T> {
  static isStateFacade(d: any): d is StateFacade<unknown> {
    return (
      typeof d === "object" &&
      d !== null &&
      d._isStateStore === STATE_STORE_SYMBOL
    );
  }

  private _isStateStore = STATE_STORE_SYMBOL;

  private initValue: T;
  private state: [T, SetArg<T>] = [undefined as any, () => {}];

  constructor(initVal: T) {
    this.initValue = initVal;
  }

  private updateNestedState(path: string, value: unknown) {
    const [currentState] = this.state;

    if (!isObject(currentState)) return;

    const parts = path.split(".");

    const newState = { ...currentState };

    let ref = newState;

    for (const [index, key] of parts.entries()) {
      const isLastKey = parts.length === index + 1;

      const elem = lodash.get(ref, key);

      lodash.set(ref, key, lodash.clone(elem));

      if (isLastKey) {
        lodash.set(ref, key, value);
      }

      ref = lodash.get(ref, key);
    }

    this.set(newState);
  }

  get(): T {
    const [stateValue] = this.state;

    if (!isObject(stateValue)) return stateValue;

    const stateProxy = Observable.create(stateValue, false, (changes) => {
      const [change] = changes;
      if (change) this.updateNestedState(change.currentPath, change.newValue);
    });

    Observable.pauseChanges(stateProxy);

    return stateProxy;
  }

  set(v: React.SetStateAction<T>): void {
    this.state[1](v);
  }

  use() {
    this.state = React.useState(this.initValue);
  }
}
