"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindClassMethods = void 0;
const bindClassMethods = (obj, prototype) => {
    const ownPropertyNames = Object.getOwnPropertyNames(prototype);
    for (const property of ownPropertyNames) {
        // @ts-expect-error
        const method = obj[property];
        if (typeof method === "function") {
            // @ts-expect-error
            obj[property] = method.bind(obj);
        }
    }
    return obj;
};
exports.bindClassMethods = bindClassMethods;
