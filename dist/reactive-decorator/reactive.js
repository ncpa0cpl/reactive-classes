"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactive = void 0;
const react_1 = __importDefault(require("react"));
const observe_object_properties_1 = require("./utils/observe-object-properties");
const reactive = (constructor) => {
    return (props) => {
        const [, forceRerender] = react_1.default.useReducer((v) => (v + 1) % 10, 0);
        const [component] = react_1.default.useState(() => (0, observe_object_properties_1.observeObjectProperties)(new constructor(), forceRerender));
        return component.render(props);
    };
};
exports.reactive = reactive;
