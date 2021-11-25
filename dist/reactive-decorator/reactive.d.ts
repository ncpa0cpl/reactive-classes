import React from "react";
import type { ReactiveClass } from "../abstract-reactive-class/abstract-reactive-class";
export declare const reactive: <P extends React.PropsWithChildren<object>>(constructor: new () => ReactiveClass<P>) => any;
