import React from "react";
import { ReactiveComponent } from "../reactive-component/reactive-component";

class AnyReactiveComponent<P> extends ReactiveComponent<P> {
  render(): React.ReactNode {
    throw new Error();
  }
}

export const reactive = <P extends React.PropsWithChildren<object>>(
  Constructor: new (props: P) => AnyReactiveComponent<P>
): any => {
  class RCC extends Constructor {
    constructor(props: P) {
      super(props);

      return this["_deproxify"]();
    }
  }

  return (props: P) => {
    const component = React.useRef<RCC>();

    if (!component.current) {
      component.current = new RCC(props);
    } else {
      component.current["_setProps"](props);

      component.current["_useHooks"]();
    }

    component.current["_useEffects"]();

    return component.current.render();
  };
};
