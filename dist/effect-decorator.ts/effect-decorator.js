"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.effect = exports.TmpEffectContainer = void 0;
const is_object_1 = require("../utils/is-object");
const EFFECT_CONTAINER_SYMBOL = Symbol();
class TmpEffectContainer {
    constructor(impl, deps) {
        this._isEffectContainer = EFFECT_CONTAINER_SYMBOL;
        this.dependencyResolver = deps;
        this.implementation = impl;
    }
    static isEffectContainer(e) {
        return ((0, is_object_1.isObject)(e) &&
            "_isEffectContainer" in e &&
            // @ts-expect-error
            e._isEffectContainer === EFFECT_CONTAINER_SYMBOL);
    }
}
exports.TmpEffectContainer = TmpEffectContainer;
function effect(deps) {
    return (target, key) => {
        const originalImplementation = target[key];
        // @ts-expect-error
        target[`__${key}_effect`] = new TmpEffectContainer(originalImplementation, deps);
        return target;
    };
}
exports.effect = effect;
