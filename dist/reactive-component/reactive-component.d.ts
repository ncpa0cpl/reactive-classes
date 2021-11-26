import type React from "react";
import { ReactiveClass } from "../reactive-class/reactive-class";
export declare abstract class ReactiveComponent<P extends React.PropsWithChildren<any> = React.PropsWithChildren<{}>> extends ReactiveClass {
    private _props;
    constructor(props: P);
    private _setProps;
    get props(): P;
    abstract render(): React.ReactNode;
    /** @deprecated */
    context: any;
    /** @deprecated */
    setState: () => void;
    /** @deprecated */
    forceUpdate: () => void;
    /** @deprecated */
    state: any;
    /** @deprecated */
    refs: any;
}
