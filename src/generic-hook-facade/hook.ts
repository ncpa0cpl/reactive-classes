import { GenericHookFacade } from "./generic-hook-facade";

export const hook = <A extends any[], R>(
  useFn: (...args: A) => R,
  ...args: A
): R => {
  return new GenericHookFacade(useFn, args) as any;
};
