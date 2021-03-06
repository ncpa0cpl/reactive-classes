import React from "react";
export declare abstract class ReactiveClass<P extends React.PropsWithChildren<any>> {
    private _original;
    private _hooks;
    private _effects;
    private _props;
    private _addHook;
    private _addEffect;
    private _useHooks;
    private _useEffects;
    private _deproxify;
    private _setProps;
    constructor(props: P);
    getProps(): P;
    abstract render(): React.ReactNode;
    /** @deprecated */
    context: any;
    /** @deprecated */
    setState: () => void;
    /** @deprecated */
    forceUpdate: () => void;
    /** @deprecated */
    props: P;
    /** @deprecated */
    state: any;
    /** @deprecated */
    refs: any;
}
