"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observeObjectProperties = void 0;
const isPrimitive = (v) => {
    const type = typeof v;
    return ["string", "number", "boolean", "symbol"].some((e) => e === type);
};
const observeObjectProperties = (obj, onChange) => {
    for (const [key, value] of Object.entries(obj)) {
        let valueContainer = value;
        Object.defineProperty(obj, key, {
            get() {
                return valueContainer;
            },
            set(newValue) {
                const hasChanged = isPrimitive(newValue)
                    ? newValue !== valueContainer
                    : true;
                valueContainer = newValue;
                if (hasChanged) {
                    onChange();
                }
            },
        });
    }
    return obj;
};
exports.observeObjectProperties = observeObjectProperties;
