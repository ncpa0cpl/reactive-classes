"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericHookWrapper = void 0;
const is_object_1 = require("../utils/is-object");
const IS_HOOK_WRAPPER = Symbol("is-hook-wrapper");
class GenericHookWrapper {
    constructor(useHook, initVal) {
        this[_a] = true;
        this.initArgs = initVal;
        this.hookImpl = useHook;
    }
    static isHookWrapper(d) {
        return (0, is_object_1.isObject)(d) && IS_HOOK_WRAPPER in d;
    }
    get() {
        return this.result;
    }
    use() {
        this.result = this.hookImpl(...this.initArgs);
    }
}
exports.GenericHookWrapper = GenericHookWrapper;
_a = IS_HOOK_WRAPPER;
