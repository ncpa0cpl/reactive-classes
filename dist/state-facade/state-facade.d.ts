export declare class StateFacade<T> {
    static isStateFacade(d: any): d is StateFacade<unknown>;
    private _isStateFacade;
    private initArg;
    private state;
    constructor(initVal: T);
    private updateNestedState;
    get(): T;
    set(v: T): void;
    use(): void;
}
