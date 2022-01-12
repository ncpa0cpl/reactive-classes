import React from "react";
import { $hook } from "../$hook/hook";

export const $context = <T>(context: React.Context<T>): T => {
  return $hook(React.useContext, context);
};
