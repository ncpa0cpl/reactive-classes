declare const IS_REACTIVE_CLASS: unique symbol;
export declare abstract class ReactiveClass {
    private readonly [IS_REACTIVE_CLASS];
    static isReactiveClass(v: any): v is ReactiveClass;
    private _original;
    private _parentClass?;
    private _hooks;
    private _effects;
    /**
     * Add the hook wrapper to the parent hook list if a parent
     * exists, or to self instance otherwise.
     */
    private _addHook;
    /**
     * Add the effect wrapper to the parent hook list if a parent
     * exists, or to self instance otherwise.
     */
    private _addEffect;
    /** Invoke all of the hooks added to this instance and it's child's. */
    private _useHooks;
    /** Invoke all of the effects added to this instance and it's child's. */
    private _useEffects;
    /**
     * Define a parent of this instance and move all effects and
     * hook wrappers to the parent.
     */
    private _setParent;
    /**
     * Return the original instance of this, without the proxy
     * that's wrapped around it.
     */
    private _deproxify;
    /**
     * Find all the methods of this instance tagged as effects, and
     * add them to the effect's list.
     */
    private _registerEffects;
    /** Bind all of the methods of this instance. */
    private _bindMethods;
    /** Register a new useState hook to this instance or it's parent. */
    private _registerState;
    /** Register a new hook to this instance or it's parent. */
    private _registerHook;
    /** Register a new ReactiveClass instance as this child. */
    private _registerChildReactiveClass;
    constructor(beforeInit?: (self: any) => void);
}
export {};
