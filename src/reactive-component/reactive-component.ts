import type React from "react";
import { ReactiveClass } from "../reactive-class/reactive-class";

export abstract class ReactiveComponent<
  P extends React.PropsWithChildren<any> = React.PropsWithChildren<{}>
> extends ReactiveClass {
  private _props!: P;

  constructor(props: P) {
    super((self: ReactiveComponent<P>) => self._setProps(props));
  }

  private _setProps(props: P) {
    this._props = props;
  }

  get props(): P {
    return this._props;
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
