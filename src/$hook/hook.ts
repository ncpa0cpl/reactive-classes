import { GenericHookWrapper } from "./generic-hook-wrapper";

export const $hook = <A extends any[], R>(
  useFn: (...args: A) => R,
  ...args: A
): R => {
  return new GenericHookWrapper(useFn, args) as any;
};
