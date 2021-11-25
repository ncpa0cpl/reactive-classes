"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = void 0;
const state_facade_1 = require("./state-facade");
const state = (state) => {
    return new state_facade_1.StateFacade(state);
};
exports.state = state;
