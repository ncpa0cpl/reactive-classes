"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMount = void 0;
const __1 = require("..");
const onMount = () => (prototype, key) => {
    const impl = prototype[key];
    prototype[key] = function () {
        impl.bind(this)();
    };
    (0, __1.effect)(() => [])(prototype, key);
};
exports.onMount = onMount;
