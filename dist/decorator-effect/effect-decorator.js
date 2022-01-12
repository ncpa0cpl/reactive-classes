"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.effect = void 0;
const metadata_1 = require("../metadata");
function effect(deps) {
    return (prototype, key) => Reflect.defineMetadata(metadata_1.MetadataKeys.Effect, deps, prototype, key);
}
exports.effect = effect;
