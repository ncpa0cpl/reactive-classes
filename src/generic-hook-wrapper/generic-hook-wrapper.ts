import { isObject } from "../utils/is-object";

const IS_HOOK_WRAPPER = Symbol("is-hook-wrapper");

export class GenericHookWrapper<T extends any[], R> {
  private [IS_HOOK_WRAPPER] = true;

  static isHookWrapper(d: any): d is GenericHookWrapper<unknown[], unknown> {
    return isObject(d) && IS_HOOK_WRAPPER in d;
  }

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
