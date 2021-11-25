"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactive = void 0;
const react_1 = __importDefault(require("react"));
const abstract_reactive_class_1 = require("../abstract-reactive-class/abstract-reactive-class");
const bind_class_methods_1 = require("../utils/bind-class-methods");
class ReactiveClassImplementation extends abstract_reactive_class_1.ReactiveClass {
    render(props) {
        throw new Error();
    }
}
const reactive = (Constructor) => {
    class RCC extends Constructor {
        constructor() {
            super();
            return (0, bind_class_methods_1.bindClassMethods)(this["_deproxify"]());
        }
    }
    return (props) => {
        const [component] = react_1.default.useState(() => new RCC());
        component["_useStates"]();
        return component.render(props);
    };
};
exports.reactive = reactive;
