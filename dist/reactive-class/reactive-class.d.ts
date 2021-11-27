export declare abstract class ReactiveClass {
    static isReactiveClass(v: any): v is ReactiveClass;
    private readonly _isReactiveClass;
    private _original;
    private _parentClass?;
    private _hooks;
    private _effects;
    private _addHook;
    private _addEffect;
    private _useHooks;
    private _useEffects;
    private _hasEffect;
    private _setParent;
    private _deproxify;
    private _registerEffects;
    private _bindMethods;
    constructor(beforeInit?: (self: any) => void);
}
