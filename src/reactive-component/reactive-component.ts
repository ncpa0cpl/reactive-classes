import type React from "react";
import { ReactiveClass } from "../reactive-class/reactive-class";

export abstract class ReactiveComponent<
  P extends React.PropsWithChildren<any> = React.PropsWithChildren<{}>
> extends ReactiveClass {
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

  abstract render(): React.ReactNode;

  /** @deprecated */
  context!: any;
  /** @deprecated */
  setState!: () => void;
  /** @deprecated */
  forceUpdate!: () => void;
  /** @deprecated */
  state!: any;
  /** @deprecated */
  refs!: any;
}
