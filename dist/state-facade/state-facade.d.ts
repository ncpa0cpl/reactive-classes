import React from "react";
export declare class StateFacade<T> {
    static isStateFacade(d: any): d is StateFacade<unknown>;
    private _isStateStore;
    private initValue;
    private state;
    constructor(initVal: T);
    private updateNestedState;
    get(): T;
    set(v: React.SetStateAction<T>): void;
    use(): void;
}
