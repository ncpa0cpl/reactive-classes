import { ReactiveClass } from "../reactive-class/reactive-class";
export declare type RHArguments<A> = A extends undefined ? [] : [() => A];
export declare abstract class ReactiveHook<A = undefined> extends ReactiveClass {
    private argsGetter;
    protected readonly args: A;
    constructor(...args: RHArguments<A>);
}
