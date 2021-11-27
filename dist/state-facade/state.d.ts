declare type StateArgument<T> = T extends undefined ? [] : [T];
export declare const $state: <T = undefined>(...args: StateArgument<T>) => T;
export {};
