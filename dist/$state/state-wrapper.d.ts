declare const IS_STATE_WRAPPER: unique symbol;
export declare class StateWrapper<T> {
    private [IS_STATE_WRAPPER];
    static isStateWrapper(d: any): d is StateWrapper<unknown>;
    private initArg;
    private state;
    constructor(initArg: T);
    private updateNestedState;
    get(): T;
    set(v: T): void;
    use(): void;
}
export {};
