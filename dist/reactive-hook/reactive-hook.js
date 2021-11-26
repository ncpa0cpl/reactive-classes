"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveHook = void 0;
const reactive_class_1 = require("../reactive-class/reactive-class");
class ReactiveHook extends reactive_class_1.ReactiveClass {
    constructor(getArgs) {
        super((self) => (self.argsGetter = getArgs));
        return this["_deproxify"]();
    }
    get args() {
        return this.argsGetter();
    }
}
exports.ReactiveHook = ReactiveHook;
