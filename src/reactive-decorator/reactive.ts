import lodash from "lodash";
import React from "react";
import { TmpEffectContainer } from "../effect-decorator/effect-decorator";
import { ReactiveComponent } from "../reactive-component/reactive-component";
import { bindClassMethods } from "../utils/bind-class-methods";

class ReactiveClassImplementation<P> extends ReactiveComponent<P> {
  render(): React.ReactNode {
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
    const component = React.useRef<RCC>();

    if (!component.current) {
      component.current = new RCC(props);

      component.current["_useEffects"]();

      return component.current.render();
    }

    component.current["_setProps"](props);

    component.current["_useHooks"]();

    component.current["_useEffects"]();

    return component.current.render();
  };
};
