import React from "react";
import { $hook } from "../generic-hook-wrapper/hook";

export const $context = <T>(context: React.Context<T>): T => {
  return $hook(React.useContext, context);
};
