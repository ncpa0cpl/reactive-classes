import type { ReactiveClass } from "..";
export declare class EffectFacade {
    static isEffectFacade(e: any): e is EffectFacade;
    private _isEffectFacade;
    private instance?;
    private effectMethodName;
    private dependencyResolver;
    constructor(effectMethodName: string, deps: (o: ReactiveClass) => any[]);
    get name(): string;
    isSameName(name: string): boolean;
    create(instance: ReactiveClass): EffectFacade;
    use(): void;
}
export declare function effect<C extends ReactiveClass>(deps: (continer: C) => any[]): any;
