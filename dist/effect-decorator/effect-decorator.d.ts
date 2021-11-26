import type { ReactiveClass } from "..";
export declare class TmpEffectContainer {
    static isEffectContainer(e: any): boolean;
    private _isEffectContainer;
    implementation: () => void | (() => void);
    dependencyResolver: (o: ReactiveClass) => any[];
    constructor(impl: () => void | (() => void), deps: (o: ReactiveClass) => any[]);
}
export declare function effect<C extends ReactiveClass>(deps: (continer: C) => any[]): any;
