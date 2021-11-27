"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveHook = void 0;
const reactive_class_1 = require("../reactive-class/reactive-class");
class ReactiveHook extends reactive_class_1.ReactiveClass {
    constructor(...args) {
        super((self) => {
            const [getArgs = () => undefined] = args;
            // @ts-expect-error
            self.argsGetter = getArgs;
        });
        const self = this;
        Object.defineProperty(self, "args", {
            get() {
                return self.argsGetter();
            },
        });
    }
}
exports.ReactiveHook = ReactiveHook;
