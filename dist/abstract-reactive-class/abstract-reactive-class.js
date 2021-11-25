"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveClass = void 0;
const react_1 = __importDefault(require("react"));
const generic_hook_facade_1 = require("../generic-hook-facade/generic-hook-facade");
const state_facade_1 = require("../state-facade/state-facade");
class ReactiveClass {
    constructor(props) {
        this._hooks = [];
        this._effects = [];
        this._props = {};
        this._original = this;
        this._setProps(props);
        const proxy = new Proxy(this, {
            set(target, key, value) {
                if (state_facade_1.StateFacade.isStateFacade(value)) {
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
                    target._addHook(value);
                    Object.defineProperty(target, key, {
                        set() {
                            throw new Error("Hook's cannot be overwritten.");
                        },
                        get() {
                            if (value.isInitiated())
                                return value.get();
                            throw new Error("Hooks cannot be accessed in the constructor.");
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
    _addHook(store) {
        this._hooks.push(store);
    }
    _addEffect(effect) {
        this._effects.push([effect.implementation, effect.dependencyResolver]);
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
    _deproxify() {
        return this._original;
    }
    _setProps(props) {
        this._props = props;
    }
    getProps() {
        return this._props;
    }
}
exports.ReactiveClass = ReactiveClass;
