import lodash from "lodash";
import Observable from "observable-slim";
import React from "react";
import { isObject } from "../utils/is-object";

type SetArg<T> = React.Dispatch<React.SetStateAction<T>>;

const IS_STATE_WRAPPER = Symbol("is-state-wrapper");

export class StateWrapper<T> {
  private [IS_STATE_WRAPPER] = true;
  static isStateWrapper(d: any): d is StateWrapper<unknown> {
    return isObject(d) && IS_STATE_WRAPPER in d;
  }

  private initArg: T;
  private state: [T, SetArg<T>] = [
    undefined as any,
    () => {
      throw new Error("State updated before initialization.");
    },
  ];

  constructor(initArg: T) {
    this.initArg = initArg;
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

  set(v: T): void {
    if (typeof v === "function") this.state[1](() => v);
    else this.state[1](v);
  }

  use() {
    this.state = React.useState(this.initArg);
  }
}
