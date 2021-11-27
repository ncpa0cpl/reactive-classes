import React from "react";
import type { ReactiveClass } from "..";
import { isObject } from "../utils/is-object";

const EFFECT_FACADE_SYMBOL = Symbol();

export class EffectFacade {
  static isEffectFacade(e: any): e is EffectFacade {
    return (
      isObject(e) &&
      "_isEffectFacade" in e &&
      // @ts-expect-error
      e._isEffectFacade === EFFECT_FACADE_SYMBOL
    );
  }

  private _isEffectFacade = EFFECT_FACADE_SYMBOL;

  private instance?: ReactiveClass;
  private effectMethodName: string;
  private dependencyResolver: (o: ReactiveClass) => any[];

  constructor(effectMethodName: string, deps: (o: ReactiveClass) => any[]) {
    this.dependencyResolver = deps;
    this.effectMethodName = effectMethodName;
  }

  get name() {
    return this.effectMethodName;
  }

  isSameName(name: string) {
    return name === this.effectMethodName;
  }

  create(instance: ReactiveClass) {
    const ef = new EffectFacade(this.effectMethodName, this.dependencyResolver);
    ef.instance = instance;
    return ef;
  }

  use() {
    if (!this.instance) {
      throw new Error();
    }

    React.useEffect(() => {
      // @ts-expect-error
      return this.instance[this.effectMethodName]();
    }, this.dependencyResolver(this.instance));
  }
}

export function effect<C extends ReactiveClass>(
  deps: (continer: C) => any[]
): any {
  return <K extends string, O extends Record<K, () => void | (() => void)>>(
    target: O,
    key: K
  ) => {
    // @ts-expect-error
    target[`__${key}_effect`] = new EffectFacade(key, deps as any);

    return target;
  };
}
