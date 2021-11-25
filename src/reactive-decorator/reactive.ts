import React from "react";
import type { ReactiveClass } from "../abstract-reactive-class/abstract-reactive-class";

export const reactive = <P extends React.PropsWithChildren<object>>(
  constructor: new () => ReactiveClass<P>
): any => {
  return (props: P) => {
    const [component] = React.useState(() => new constructor()["_deproxify"]());
    component["_useStates"]();

    return component.render(props);
  };
};
