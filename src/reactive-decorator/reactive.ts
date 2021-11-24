import React from "react";
import { observeObjectProperties } from "./utils/observe-object-properties";

export interface ReactiveClassComponent<
  P extends React.PropsWithChildren<object> = {}
> {
  render(props: P): JSX.Element;
}

export const reactive = <P extends React.PropsWithChildren<object>>(
  constructor: new () => ReactiveClassComponent<P>
): any => {
  return (props: P) => {
    const [, forceRerender] = React.useReducer((v: number) => (v + 1) % 10, 0);

    const [component] = React.useState(() =>
      observeObjectProperties(new constructor(), forceRerender)
    );

    return component.render(props);
  };
};
