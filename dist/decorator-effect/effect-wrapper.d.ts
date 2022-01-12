import React from "react";
import type { ReactiveClass } from "..";
export declare type DependencyResolver<O extends ReactiveClass = ReactiveClass> = (origin: O) => React.DependencyList | undefined;
export declare class EffectWrapper {
    private origin;
    private invoke;
    private dependencyResolver;
    constructor(origin: ReactiveClass, invoke: (origin: ReactiveClass) => React.EffectCallback, dependencyResolver: DependencyResolver);
    use(): void;
}
