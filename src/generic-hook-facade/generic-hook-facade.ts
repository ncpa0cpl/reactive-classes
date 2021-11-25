const HOOK_FACADE_SYMBOL = Symbol();

export class GenericHookFacade<T extends any[], R> {
  static isHookFacade(d: any): d is GenericHookFacade<unknown[], unknown> {
    return (
      typeof d === "object" &&
      d !== null &&
      d._isHookFacade === HOOK_FACADE_SYMBOL
    );
  }

  private _isHookFacade = HOOK_FACADE_SYMBOL;

  private initArgs: T;
  private result!: R;

  private hookImpl: (...args: T) => R;

  constructor(useHook: (...args: T) => R, initVal: T) {
    this.initArgs = initVal;
    this.hookImpl = useHook;
  }

  get(): R {
    return this.result;
  }

  use() {
    this.result = this.hookImpl(...this.initArgs);
  }
}
