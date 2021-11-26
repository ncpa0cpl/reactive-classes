import { ReactiveClass } from "../reactive-class/reactive-class";
export declare abstract class ReactiveHook<A> extends ReactiveClass {
    private argsGetter;
    constructor(getArgs: () => A);
    protected get args(): A;
}
