declare const IS_HOOK_WRAPPER: unique symbol;
export declare class GenericHookWrapper<T extends any[], R> {
    private [IS_HOOK_WRAPPER];
    static isHookWrapper(d: any): d is GenericHookWrapper<unknown[], unknown>;
    private initArgs;
    private result;
    private hookImpl;
    constructor(useHook: (...args: T) => R, initVal: T);
    get(): R;
    use(): void;
}
export {};
