"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactive = void 0;
const react_1 = __importDefault(require("react"));
const reactive = (constructor) => {
    return (props) => {
        const [component] = react_1.default.useState(() => new constructor()["_deproxify"]());
        component["_useStates"]();
        return component.render(props);
    };
};
exports.reactive = reactive;
