"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveClass = void 0;
const generic_hook_wrapper_1 = require("../$hook/generic-hook-wrapper");
const state_wrapper_1 = require("../$state/state-wrapper");
const effect_wrapper_1 = require("../decorator-effect/effect-wrapper");
const metadata_1 = require("../metadata");
const bind_class_methods_1 = require("../utils/bind-class-methods");
const is_object_1 = require("../utils/is-object");
const IS_REACTIVE_CLASS = Symbol("is-reactive-class");
class ReactiveClass {
    constructor(beforeInit) {
        this[_a] = true;
        this._hooks = [];
        this._effects = [];
        if (beforeInit) {
            beforeInit(this);
        }
        this._original = this;
        this._registerEffects();
        this._bindMethods();
        const proxy = new Proxy(this, {
            set(target, key, value) {
                if (state_wrapper_1.StateWrapper.isStateWrapper(value)) {
                    target._registerState(key, value);
                }
                else if (generic_hook_wrapper_1.GenericHookWrapper.isHookWrapper(value)) {
                    target._registerHook(key, value);
                }
                else if (ReactiveClass.isReactiveClass(value)) {
                    target._registerChildReactiveClass(key, value);
                }
                else {
                    Object.defineProperty(target, key, { value });
                }
                return true;
            },
        });
        return proxy;
    }
    static isReactiveClass(v) {
        return (0, is_object_1.isObject)(v) && IS_REACTIVE_CLASS in v;
    }
    /**
     * Add the hook wrapper to the parent hook list if a parent
     * exists, or to self instance otherwise.
     */
    _addHook(hook) {
        if (this._parentClass) {
            return this._parentClass._addHook(hook);
        }
        this._hooks.push(hook);
    }
    /**
     * Add the effect wrapper to the parent hook list if a parent
     * exists, or to self instance otherwise.
     */
    _addEffect(effect) {
        if (this._parentClass) {
            return this._parentClass._addEffect(effect);
        }
        this._effects.push(effect);
    }
    /** Invoke all of the hooks added to this instance and it's child's. */
    _useHooks() {
        for (const hook of this._hooks) {
            hook.use();
        }
    }
    /** Invoke all of the effects added to this instance and it's child's. */
    _useEffects() {
        for (const effect of this._effects) {
            effect.use();
        }
    }
    /**
     * Define a parent of this instance and move all effects and
     * hook wrappers to the parent.
     */
    _setParent(parent) {
        this._original._parentClass = parent;
        for (const hook of this._original._hooks.splice(0)) {
            parent._addHook(hook);
        }
        for (const effect of this._original._effects.splice(0)) {
            parent._addEffect(effect);
        }
    }
    /**
     * Return the original instance of this, without the proxy
     * that's wrapped around it.
     */
    _deproxify() {
        return this._original;
    }
    /**
     * Find all the methods of this instance tagged as effects, and
     * add them to the effect's list.
     */
    _registerEffects() {
        let proto = Object.getPrototypeOf(this._original);
        while (proto && proto !== ReactiveClass.prototype) {
            const methodNames = Object.getOwnPropertyNames(proto);
            for (const methodName of methodNames) {
                if (Reflect.hasMetadata(metadata_1.MetadataKeys.Effect, this, methodName)) {
                    const dependencyResolver = Reflect.getMetadata(metadata_1.MetadataKeys.Effect, this, methodName);
                    this._addEffect(new effect_wrapper_1.EffectWrapper(this, 
                    // @ts-expect-error
                    (origin) => origin[methodName](), (origin) => dependencyResolver(origin)));
                }
            }
            try {
                proto = Object.getPrototypeOf(proto);
            }
            catch (_b) {
                proto = undefined;
            }
        }
    }
    /** Bind all of the methods of this instance. */
    _bindMethods() {
        let proto = Object.getPrototypeOf(this._original);
        while (proto && proto !== ReactiveClass.prototype) {
            (0, bind_class_methods_1.bindClassMethods)(this._original, proto);
            try {
                proto = Object.getPrototypeOf(proto);
            }
            catch (_b) {
                proto = undefined;
            }
        }
    }
    /** Register a new useState hook to this instance or it's parent. */
    _registerState(key, state) {
        state.use();
        this._original._addHook(state);
        Object.defineProperty(this._original, key, {
            set(v) {
                state.set(v);
                return true;
            },
            get() {
                return state.get();
            },
        });
    }
    /** Register a new hook to this instance or it's parent. */
    _registerHook(key, hook) {
        hook.use();
        this._original._addHook(hook);
        Object.defineProperty(this._original, key, {
            set() {
                throw new Error("Hook's cannot be overwritten.");
            },
            get() {
                return hook.get();
            },
        });
    }
    /** Register a new ReactiveClass instance as this child. */
    _registerChildReactiveClass(key, child) {
        child._setParent(this._original);
        Object.defineProperty(this._original, key, {
            set() {
                throw new Error("Hook's cannot be overwritten.");
            },
            get() {
                return child._original;
            },
        });
    }
}
exports.ReactiveClass = ReactiveClass;
_a = IS_REACTIVE_CLASS;
