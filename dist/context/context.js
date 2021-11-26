"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$context = void 0;
const react_1 = __importDefault(require("react"));
const hook_1 = require("../generic-hook-facade/hook");
const $context = (context) => {
    return (0, hook_1.$hook)(react_1.default.useContext, context);
};
exports.$context = $context;
