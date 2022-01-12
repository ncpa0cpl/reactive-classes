"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUnmount = void 0;
const __1 = require("..");
const onUnmount = () => (prototype, key) => {
    const impl = prototype[key];
    prototype[key] = function () {
        return impl.bind(this);
    };
    (0, __1.effect)(() => [])(prototype, key);
};
exports.onUnmount = onUnmount;
