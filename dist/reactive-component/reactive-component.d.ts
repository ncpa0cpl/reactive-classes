import type React from "react";
import { ReactiveClass } from "../reactive-class/reactive-class";
export declare abstract class ReactiveComponent<P extends React.PropsWithChildren<any> = React.PropsWithChildren<{}>> extends ReactiveClass {
    private _forceRenderCounter;
    private _props;
    readonly props: P;
    constructor(props: P);
    private _setProps;
    forceUpdate(): void;
    abstract render(): React.ReactNode;
    /** @deprecated */
    context: any;
    /** @deprecated */
    setState: () => void;
    /** @deprecated */
    state: any;
    /** @deprecated */
    refs: any;
}
