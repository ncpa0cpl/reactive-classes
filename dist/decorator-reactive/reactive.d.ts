import React from "react";
import { ReactiveComponent } from "../reactive-component/reactive-component";
declare class AnyReactiveComponent<P> extends ReactiveComponent<P> {
    render(): React.ReactNode;
}
export declare const reactive: <P extends React.PropsWithChildren<object>>(Constructor: new (props: P) => AnyReactiveComponent<P>) => any;
export {};
