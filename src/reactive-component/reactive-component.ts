import type React from "react";
import { $state } from "..";
import { ReactiveClass } from "../reactive-class/reactive-class";

export abstract class ReactiveComponent<
  P extends React.PropsWithChildren<any> = React.PropsWithChildren<{}>
> extends ReactiveClass {
  private _forceRenderCounter = $state(0);
  private _props!: P;
  readonly props!: P;

  constructor(props: P) {
    super((self: ReactiveComponent<P>) => self._setProps(props));

    const self = this;

    Object.defineProperty(self, "props", {
      get() {
        return self._props;
      },
    });
  }

  private _setProps(props: P) {
    this._props = props;
  }

  forceUpdate() {
    this._forceRenderCounter += 1;
  }

  abstract render(): React.ReactNode;

  /** @deprecated */
  context!: any;
  /** @deprecated */
  setState!: () => void;
  /** @deprecated */
  state!: any;
  /** @deprecated */
  refs!: any;
}
