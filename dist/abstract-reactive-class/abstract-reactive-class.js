"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveClass = void 0;
const state_facade_1 = require("../state-facade/state-facade");
class ReactiveClass {
    constructor() {
        this._stateFacades = [];
        this._original = this;
        const proxy = new Proxy(this, {
            set(target, key, value) {
                if (state_facade_1.StateFacade.isStateFacade(value)) {
                    target._addState(value);
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
                else {
                    // @ts-ignore
                    target[key] = value;
                }
                return true;
            },
        });
        return proxy;
    }
    _addState(store) {
        this._stateFacades.push(store);
    }
    _useStates() {
        for (const facade of this._stateFacades) {
            facade.use();
        }
    }
    _deproxify() {
        return this._original;
    }
}
exports.ReactiveClass = ReactiveClass;
