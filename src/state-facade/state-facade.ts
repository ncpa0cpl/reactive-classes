import lodash from "lodash";
import Observable from "observable-slim";
import React from "react";
import { isObject } from "../utils/is-object";

type SetArg<T> = React.Dispatch<React.SetStateAction<T>>;

const STATE_FACADE_SYMBOL = Symbol();

export class StateFacade<T> {
  static isStateFacade(d: any): d is StateFacade<unknown> {
    return (
      typeof d === "object" &&
      d !== null &&
      d._isStateFacade === STATE_FACADE_SYMBOL
    );
  }

  private _isStateFacade = STATE_FACADE_SYMBOL;

  private hasBeenUsed = false;
  private initArg: T;
  private state: [T, SetArg<T>] = [
    undefined as any,
    () => {
      throw new Error("State cannot be updated in the constructor.");
    },
  ];

  constructor(initVal: T) {
    this.initArg = initVal;
  }

  private updateNestedState(path: string, value: unknown) {
    const [_, setState] = this.state;

    setState((currentState) => {
      if (!isObject(currentState))
        throw new TypeError(
          `'${path}' does not exists on ${typeof currentState}`
        );

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

      return newState;
    });
  }

  isInitiated() {
    return this.hasBeenUsed;
  }

  get(): T {
    const [stateValue] = this.hasBeenUsed ? this.state : [this.initArg];

    if (!isObject(stateValue)) return stateValue;

    const stateProxy = Observable.create(stateValue, false, (changes) => {
      const [change] = changes;
      if (change) this.updateNestedState(change.currentPath, change.newValue);
    });

    Observable.pauseChanges(stateProxy);

    return stateProxy;
  }

  set(v: T): void {
    if (typeof v === "function") this.state[1](() => v);
    else this.state[1](v);
  }

  use() {
    this.state = React.useState(this.initArg);
    this.hasBeenUsed = true;
  }
}
