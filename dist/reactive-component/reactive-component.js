"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveComponent = void 0;
const __1 = require("..");
const reactive_class_1 = require("../reactive-class/reactive-class");
class ReactiveComponent extends reactive_class_1.ReactiveClass {
    constructor(props) {
        super((self) => self._setProps(props));
        this._forceRenderCounter = (0, __1.$state)(0);
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
    forceUpdate() {
        this._forceRenderCounter += 1;
    }
}
exports.ReactiveComponent = ReactiveComponent;
