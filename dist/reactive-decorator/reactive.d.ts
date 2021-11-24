import React from "react";
export interface ReactiveClassComponent<P extends React.PropsWithChildren<object> = {}> {
    render(props: P): JSX.Element;
}
export declare const reactive: <P extends React.PropsWithChildren<object>>(constructor: new () => ReactiveClassComponent<P>) => any;
