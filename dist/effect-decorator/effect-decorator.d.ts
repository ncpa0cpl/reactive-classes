import type { ReactiveClass } from "..";
export declare class TmpEffectContainer {
    static isEffectContainer(e: any): boolean;
    private _isEffectContainer;
    implementation: () => void | (() => void);
    dependencyResolver: (o: ReactiveClass<any>) => any[];
    constructor(impl: () => void | (() => void), deps: (o: ReactiveClass<any>) => any[]);
}
export declare function effect<C extends ReactiveClass<any>>(deps: (continer: C) => any[]): any;
