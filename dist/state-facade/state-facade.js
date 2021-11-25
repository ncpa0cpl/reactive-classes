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
const STATE_STORE_SYMBOL = Symbol();
class StateFacade {
    constructor(initVal) {
        this._isStateStore = STATE_STORE_SYMBOL;
        this.state = [undefined, () => { }];
        this.initValue = initVal;
    }
    static isStateFacade(d) {
        return (typeof d === "object" &&
            d !== null &&
            d._isStateStore === STATE_STORE_SYMBOL);
    }
    updateNestedState(path, value) {
        const [currentState] = this.state;
        if (!(0, is_object_1.isObject)(currentState))
            return;
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
        this.set(newState);
    }
    get() {
        const [stateValue] = this.state;
        if (!(0, is_object_1.isObject)(stateValue))
            return stateValue;
        const stateProxy = observable_slim_1.default.create(stateValue, false, (change) => {
            this.updateNestedState(change.currentPath, change.newValue);
        });
        observable_slim_1.default.pauseChanges(stateProxy);
        return stateProxy;
    }
    set(v) {
        this.state[1](v);
    }
    use() {
        this.state = react_1.default.useState(this.initValue);
    }
}
exports.StateFacade = StateFacade;
