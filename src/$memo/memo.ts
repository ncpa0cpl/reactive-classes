import React from "react";
import { $hook } from "..";

export const $memo = <R>(
  generator: () => R,
  deps: () => React.DependencyList | undefined = () => undefined
): R => {
  return $hook(() => React.useMemo(generator, deps()));
};
