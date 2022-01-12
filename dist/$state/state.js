"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$state = void 0;
const state_wrapper_1 = require("./state-wrapper");
const $state = (...args) => {
    var _a;
    return new state_wrapper_1.StateWrapper((_a = args[0]) !== null && _a !== void 0 ? _a : undefined);
};
exports.$state = $state;
