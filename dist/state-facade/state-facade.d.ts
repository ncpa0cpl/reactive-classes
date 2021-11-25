export declare class StateFacade<T> {
    static isStateFacade(d: any): d is StateFacade<unknown>;
    private _isStateFacade;
    private hasBeenUsed;
    private initArg;
    private state;
    constructor(initVal: T);
    private updateNestedState;
    isInitiated(): boolean;
    get(): T;
    set(v: T): void;
    use(): void;
}
