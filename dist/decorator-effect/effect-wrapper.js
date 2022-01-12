"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectWrapper = void 0;
const react_1 = __importDefault(require("react"));
class EffectWrapper {
    constructor(origin, invoke, dependencyResolver) {
        this.origin = origin;
        this.invoke = invoke;
        this.dependencyResolver = dependencyResolver;
    }
    use() {
        react_1.default.useEffect(() => {
            return this.invoke(this.origin)();
        }, this.dependencyResolver(this.origin));
    }
}
exports.EffectWrapper = EffectWrapper;
