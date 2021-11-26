"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactive = void 0;
const react_1 = __importDefault(require("react"));
const reactive_component_1 = require("../reactive-component/reactive-component");
class ReactiveClassImplementation extends reactive_component_1.ReactiveComponent {
    render() {
        throw new Error();
    }
}
const reactive = (Constructor) => {
    class RCC extends Constructor {
        constructor(props) {
            super(props);
            return this["_deproxify"]();
        }
    }
    return (props) => {
        const component = react_1.default.useRef();
        if (!component.current) {
            component.current = new RCC(props);
            component.current["_useEffects"]();
            return component.current.render();
        }
        component.current["_setProps"](props);
        component.current["_useHooks"]();
        component.current["_useEffects"]();
        return component.current.render();
    };
};
exports.reactive = reactive;
