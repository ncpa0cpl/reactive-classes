"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactive = void 0;
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const abstract_reactive_class_1 = require("../abstract-reactive-class/abstract-reactive-class");
const effect_decorator_1 = require("../effect-decorator/effect-decorator");
const bind_class_methods_1 = require("../utils/bind-class-methods");
class ReactiveClassImplementation extends abstract_reactive_class_1.ReactiveClass {
    render() {
        throw new Error();
    }
}
const reactive = (Constructor) => {
    class RCC extends Constructor {
        constructor(props) {
            super(props);
            for (const property of Object.getOwnPropertyNames(Constructor.prototype)) {
                const v = lodash_1.default.get(this, property);
                if (effect_decorator_1.TmpEffectContainer.isEffectContainer(v)) {
                    this["_addEffect"](v);
                }
            }
            return (0, bind_class_methods_1.bindClassMethods)(this["_deproxify"](), Constructor.prototype);
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
