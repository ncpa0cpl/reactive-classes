import type { ReactiveClass } from "..";
import { isObject } from "../utils/is-object";

const EFFECT_CONTAINER_SYMBOL = Symbol();

export class TmpEffectContainer {
  static isEffectContainer(e: any) {
    return (
      isObject(e) &&
      "_isEffectContainer" in e &&
      // @ts-expect-error
      e._isEffectContainer === EFFECT_CONTAINER_SYMBOL
    );
  }

  private _isEffectContainer = EFFECT_CONTAINER_SYMBOL;

  implementation: () => void | (() => void);
  dependencyResolver: (o: ReactiveClass) => any[];

  constructor(
    impl: () => void | (() => void),
    deps: (o: ReactiveClass) => any[]
  ) {
    this.dependencyResolver = deps;
    this.implementation = impl;
  }
}

export function effect<C extends ReactiveClass>(
  deps: (continer: C) => any[]
): any {
  return <K extends string, O extends Record<K, () => void | (() => void)>>(
    target: O,
    key: K
  ) => {
    const originalImplementation = target[key];

    // @ts-expect-error
    target[`__${key}_effect`] = new TmpEffectContainer(
      originalImplementation,
      deps as any
    );

    return target;
  };
}
