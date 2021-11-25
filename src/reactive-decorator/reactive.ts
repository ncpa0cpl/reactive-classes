import lodash from "lodash";
import React from "react";
import { ReactiveClass } from "../abstract-reactive-class/abstract-reactive-class";
import { TmpEffectContainer } from "../effect-decorator/effect-decorator";
import { bindClassMethods } from "../utils/bind-class-methods";

class ReactiveClassImplementation<P> extends ReactiveClass<P> {
  render(props: P): JSX.Element {
    throw new Error();
  }
}

export const reactive = <P extends React.PropsWithChildren<object>>(
  Constructor: new (props: P) => ReactiveClassImplementation<P>
): any => {
  class RCC extends Constructor {
    constructor(props: P) {
      super(props);

      for (const property of Object.getOwnPropertyNames(
        Constructor.prototype
      )) {
        const v = lodash.get(this, property);

        if (TmpEffectContainer.isEffectContainer(v)) {
          this["_addEffect"](v);
        }
      }

      return bindClassMethods(this["_deproxify"](), Constructor.prototype);
    }
  }

  return (props: P) => {
    const [component] = React.useState(() => new RCC(props));

    component["_setProps"](props);

    component["_useHooks"]();

    component["_useEffects"]();

    return component.render(props);
  };
};
