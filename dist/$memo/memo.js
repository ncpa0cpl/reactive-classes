"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$memo = void 0;
const react_1 = __importDefault(require("react"));
const __1 = require("..");
const $memo = (generator, deps = () => undefined) => {
    return (0, __1.$hook)(() => react_1.default.useMemo(generator, deps()));
};
exports.$memo = $memo;
