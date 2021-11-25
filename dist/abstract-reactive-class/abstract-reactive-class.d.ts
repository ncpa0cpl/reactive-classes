import type React from "react";
export declare abstract class ReactiveClass<P extends React.PropsWithChildren<any>> {
    private _original;
    private _stateFacades;
    private _addState;
    private _useStates;
    private _deproxify;
    constructor();
    abstract render(props: P): JSX.Element;
}
