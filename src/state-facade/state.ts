import { StateFacade } from "./state-facade";

type StateArgument<T> = T extends undefined ? [] : [T];

export const $state = <T = undefined>(...args: StateArgument<T>): T => {
  return new StateFacade(args[0] ?? undefined) as any;
};
