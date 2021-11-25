"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hook = void 0;
const generic_hook_facade_1 = require("./generic-hook-facade");
const hook = (useFn, ...args) => {
    return new generic_hook_facade_1.GenericHookFacade(useFn, args);
};
exports.hook = hook;
