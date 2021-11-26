import { StateFacade } from "./state-facade";

export const $state = <T>(state: T): T => {
  return new StateFacade(state) as any;
};
