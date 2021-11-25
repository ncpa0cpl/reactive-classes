export declare class GenericHookFacade<T extends any[], R> {
    static isHookFacade(d: any): d is GenericHookFacade<unknown[], unknown>;
    private _isHookFacade;
    private hasBeenUsed;
    private initArgs;
    private result;
    private hookImpl;
    constructor(useHook: (...args: T) => R, initVal: T);
    isInitiated(): boolean;
    get(): R;
    use(): void;
}
