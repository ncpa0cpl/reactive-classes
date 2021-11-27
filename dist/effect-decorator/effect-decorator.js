"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.effect = exports.EffectFacade = void 0;
const react_1 = __importDefault(require("react"));
const is_object_1 = require("../utils/is-object");
const EFFECT_FACADE_SYMBOL = Symbol();
class EffectFacade {
    constructor(effectMethodName, deps) {
        this._isEffectFacade = EFFECT_FACADE_SYMBOL;
        this.dependencyResolver = deps;
        this.effectMethodName = effectMethodName;
    }
    static isEffectFacade(e) {
        return ((0, is_object_1.isObject)(e) &&
            "_isEffectFacade" in e &&
            // @ts-expect-error
            e._isEffectFacade === EFFECT_FACADE_SYMBOL);
    }
    get name() {
        return this.effectMethodName;
    }
    isSameName(name) {
        return name === this.effectMethodName;
    }
    create(instance) {
        const ef = new EffectFacade(this.effectMethodName, this.dependencyResolver);
        ef.instance = instance;
        return ef;
    }
    use() {
        if (!this.instance) {
            throw new Error();
        }
        react_1.default.useEffect(() => {
            // @ts-expect-error
            return this.instance[this.effectMethodName]();
        }, this.dependencyResolver(this.instance));
    }
}
exports.EffectFacade = EffectFacade;
function effect(deps) {
    return (target, key) => {
        // @ts-expect-error
        target[`__${key}_effect`] = new EffectFacade(key, deps);
        return target;
    };
}
exports.effect = effect;
