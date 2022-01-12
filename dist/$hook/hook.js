"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$hook = void 0;
const generic_hook_wrapper_1 = require("./generic-hook-wrapper");
const $hook = (useFn, ...args) => {
    return new generic_hook_wrapper_1.GenericHookWrapper(useFn, args);
};
exports.$hook = $hook;
