import React from "react";
import type { ReactiveClass } from "..";

export type DependencyResolver<O extends ReactiveClass = ReactiveClass> = (
  origin: O
) => React.DependencyList | undefined;

export class EffectWrapper {
  private origin: ReactiveClass;
  private invoke: (origin: ReactiveClass) => React.EffectCallback;
  private dependencyResolver: DependencyResolver;

  constructor(
    origin: ReactiveClass,
    invoke: (origin: ReactiveClass) => React.EffectCallback,
    dependencyResolver: DependencyResolver
  ) {
    this.origin = origin;
    this.invoke = invoke;
    this.dependencyResolver = dependencyResolver;
  }

  use() {
    React.useEffect(() => {
      return this.invoke(this.origin)();
    }, this.dependencyResolver(this.origin));
  }
}
