"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPath = void 0;
const extractPath = (obj, path) => {
    for (const part of path) {
        if (part in obj) {
            // @ts-expect-error
            obj = obj[part];
        }
        else {
            return undefined;
        }
    }
    return obj;
};
exports.extractPath = extractPath;
