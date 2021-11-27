"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveComponent = void 0;
const reactive_class_1 = require("../reactive-class/reactive-class");
class ReactiveComponent extends reactive_class_1.ReactiveClass {
    constructor(props) {
        super((self) => self._setProps(props));
        const self = this;
        Object.defineProperty(self, "props", {
            get() {
                return self._props;
            },
        });
    }
    _setProps(props) {
        this._props = props;
    }
}
exports.ReactiveComponent = ReactiveComponent;
