"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$state = void 0;
const state_facade_1 = require("./state-facade");
const $state = (...args) => {
    var _a;
    return new state_facade_1.StateFacade((_a = args[0]) !== null && _a !== void 0 ? _a : undefined);
};
exports.$state = $state;
