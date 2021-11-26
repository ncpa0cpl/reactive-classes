"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveClass = void 0;
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const effect_decorator_1 = require("../effect-decorator/effect-decorator");
const generic_hook_facade_1 = require("../generic-hook-facade/generic-hook-facade");
const state_facade_1 = require("../state-facade/state-facade");
const bind_class_methods_1 = require("../utils/bind-class-methods");
const is_object_1 = require("../utils/is-object");
const REACTIVE_CLASS_SYMBOL = Symbol();
class ReactiveClass {
    constructor(beforeInit) {
        this._isReactiveClass = REACTIVE_CLASS_SYMBOL;
        this._hooks = [];
        this._effects = [];
        beforeInit ? beforeInit(this) : void 0;
        this._original = this;
        this._registerEffects();
        this._bindMethods();
        const proxy = new Proxy(this, {
            set(target, key, value) {
                if (state_facade_1.StateFacade.isStateFacade(value)) {
                    value.use();
                    target._addHook(value);
                    Object.defineProperty(target, key, {
                        set(v) {
                            value.set(v);
                            return true;
                        },
                        get() {
                            return value.get();
                        },
                    });
                }
                else if (generic_hook_facade_1.GenericHookFacade.isHookFacade(value)) {
                    value.use();
                    target._addHook(value);
                    Object.defineProperty(target, key, {
                        set() {
                            throw new Error("Hook's cannot be overwritten.");
                        },
                        get() {
                            return value.get();
                        },
                    });
                }
                else if (ReactiveClass.isReactiveClass(value)) {
                    value._setParent(target);
                    Object.defineProperty(target, key, {
                        set() {
                            throw new Error("Hook's cannot be overwritten.");
                        },
                        get() {
                            return value._original;
                        },
                    });
                }
                else {
                    // @ts-ignore
                    target[key] = value;
                }
                return true;
            },
        });
        return proxy;
    }
    static isReactiveClass(v) {
        return ((0, is_object_1.isObject)(v) &&
            "_isReactiveClass" in v &&
            // @ts-expect-error
            v._isReactiveClass === REACTIVE_CLASS_SYMBOL);
    }
    _addHook(hook) {
        if (this._parentClass) {
            return this._parentClass._addHook(hook);
        }
        this._hooks.push(hook);
    }
    _addEffect(effect) {
        if (this._parentClass) {
            return this._parentClass._addEffect(effect);
        }
        this._effects.push([
            effect.implementation.bind(this),
            effect.dependencyResolver,
        ]);
    }
    _useHooks() {
        for (const facade of this._hooks) {
            facade.use();
        }
    }
    _useEffects() {
        for (const [impl, getDeps] of this._effects) {
            react_1.default.useEffect(impl, getDeps(this));
        }
    }
    _setParent(parent) {
        this._original._parentClass = parent;
        for (const hook of this._original._hooks.splice(0)) {
            parent._addHook(hook);
        }
        for (const [impl, getDeps] of this._original._effects.splice(0)) {
            parent._addEffect(new effect_decorator_1.TmpEffectContainer(impl, () => getDeps(this)));
        }
    }
    _deproxify() {
        return this._original;
    }
    _registerEffects() {
        const methodList = Object.getOwnPropertyNames(Object.getPrototypeOf(this._original));
        for (const methodName of methodList) {
            const v = lodash_1.default.get(this, methodName);
            if (effect_decorator_1.TmpEffectContainer.isEffectContainer(v)) {
                this["_addEffect"](v);
            }
        }
    }
    _bindMethods() {
        let proto = Object.getPrototypeOf(this._original);
        while (proto && proto !== ReactiveClass.prototype) {
            (0, bind_class_methods_1.bindClassMethods)(this._original, proto);
            try {
                proto = Object.getPrototypeOf(proto);
            }
            catch (_a) {
                //
            }
        }
    }
}
exports.ReactiveClass = ReactiveClass;
