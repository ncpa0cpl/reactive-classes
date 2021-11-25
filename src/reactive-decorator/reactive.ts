import React from "react";
import { ReactiveClass } from "../abstract-reactive-class/abstract-reactive-class";
import { bindClassMethods } from "../utils/bind-class-methods";

class ReactiveClassImplementation<P> extends ReactiveClass<P> {
  render(props: P): JSX.Element {
    throw new Error();
  }
}

export const reactive = <P extends React.PropsWithChildren<object>>(
  Constructor: new () => ReactiveClassImplementation<P>
): any => {
  class RCC extends Constructor {
    constructor() {
      super();

      return bindClassMethods(this["_deproxify"](), Constructor.prototype);
    }
  }

  return (props: P) => {
    const [component] = React.useState(() => new RCC());
    component["_useStates"]();

    return component.render(props);
  };
};
