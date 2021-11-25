import React from "react";
import { ReactiveClass } from "../abstract-reactive-class/abstract-reactive-class";
declare class ReactiveClassImplementation<P> extends ReactiveClass<P> {
    render(): React.ReactNode;
}
export declare const reactive: <P extends React.PropsWithChildren<object>>(Constructor: new (props: P) => ReactiveClassImplementation<P>) => any;
export {};
