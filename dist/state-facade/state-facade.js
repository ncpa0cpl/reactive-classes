"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateFacade = void 0;
const lodash_1 = __importDefault(require("lodash"));
const observable_slim_1 = __importDefault(require("observable-slim"));
const react_1 = __importDefault(require("react"));
const is_object_1 = require("../utils/is-object");
const STATE_FACADE_SYMBOL = Symbol();
class StateFacade {
    constructor(initVal) {
        this._isStateFacade = STATE_FACADE_SYMBOL;
        this.hasBeenUsed = false;
        this.state = [
            undefined,
            () => {
                throw new Error("State cannot be updated in the constructor.");
            },
        ];
        this.initArg = initVal;
    }
    static isStateFacade(d) {
        return (typeof d === "object" &&
            d !== null &&
            d._isStateFacade === STATE_FACADE_SYMBOL);
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
    isInitiated() {
        return this.hasBeenUsed;
    }
    get() {
        const [stateValue] = this.hasBeenUsed ? this.state : [this.initArg];
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
        this.hasBeenUsed = true;
    }
}
exports.StateFacade = StateFacade;
