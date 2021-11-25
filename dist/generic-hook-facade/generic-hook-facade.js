"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericHookFacade = void 0;
const HOOK_FACADE_SYMBOL = Symbol();
class GenericHookFacade {
    constructor(useHook, initVal) {
        this._isHookFacade = HOOK_FACADE_SYMBOL;
        this.hasBeenUsed = false;
        this.initArgs = initVal;
        this.hookImpl = useHook;
    }
    static isHookFacade(d) {
        return (typeof d === "object" &&
            d !== null &&
            d._isHookFacade === HOOK_FACADE_SYMBOL);
    }
    isInitiated() {
        return this.hasBeenUsed;
    }
    get() {
        return this.result;
    }
    use() {
        this.result = this.hookImpl(...this.initArgs);
        this.hasBeenUsed = true;
    }
}
exports.GenericHookFacade = GenericHookFacade;
