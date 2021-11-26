import { ReactiveClass } from "../reactive-class/reactive-class";

export abstract class ReactiveHook<A> extends ReactiveClass {
  private argsGetter!: () => A;

  constructor(getArgs: () => A) {
    super((self: ReactiveHook<A>) => (self.argsGetter = getArgs));
  }

  protected get args(): A {
    return this.argsGetter();
  }
}
