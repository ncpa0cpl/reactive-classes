import { StateWrapper } from "./state-wrapper";

type StateArgument<T> = T extends undefined ? [] : [T];

export const $state = <T = undefined>(...args: StateArgument<T>): T => {
  return new StateWrapper(args[0] ?? undefined) as any;
};
