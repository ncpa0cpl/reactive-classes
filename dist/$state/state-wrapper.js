"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateWrapper = void 0;
const lodash_1 = __importDefault(require("lodash"));
const observable_slim_1 = __importDefault(require("observable-slim"));
const react_1 = __importDefault(require("react"));
const is_object_1 = require("../utils/is-object");
const IS_STATE_WRAPPER = Symbol("is-state-wrapper");
class StateWrapper {
    constructor(initArg) {
        this[_a] = true;
        this.state = [
            undefined,
            () => {
                throw new Error("State updated before initialization.");
            },
        ];
        this.initArg = initArg;
    }
    static isStateWrapper(d) {
        return (0, is_object_1.isObject)(d) && IS_STATE_WRAPPER in d;
    }
    updateNestedState(path, value) {
        const [_, setState] = this.state;
        setState((currentState) => {
            if (!(0, is_object_1.isObject)(currentState))
                throw new TypeError(`'${path}' does not exists on ${typeof currentState}`);
            const parts = path.split(".");
            const newState = Object.assign({}, currentState);
            let ref = newState;
            for (const [index, key] of parts.entries()) {
                const isLastKey = parts.length === index + 1;
                const elem = lodash_1.default.get(ref, key);
                lodash_1.default.set(ref, key, lodash_1.default.clone(elem));
                if (isLastKey) {
                    lodash_1.default.set(ref, key, value);
                }
                ref = lodash_1.default.get(ref, key);
            }
            return newState;
        });
    }
    get() {
        const [stateValue] = this.state;
        if (!(0, is_object_1.isObject)(stateValue))
            return stateValue;
        const stateProxy = observable_slim_1.default.create(stateValue, false, (changes) => {
            const [change] = changes;
            if (change)
                this.updateNestedState(change.currentPath, change.newValue);
        });
        observable_slim_1.default.pauseChanges(stateProxy);
        return stateProxy;
    }
    set(v) {
        if (typeof v === "function")
            this.state[1](() => v);
        else
            this.state[1](v);
    }
    use() {
        this.state = react_1.default.useState(this.initArg);
    }
}
exports.StateWrapper = StateWrapper;
_a = IS_STATE_WRAPPER;
