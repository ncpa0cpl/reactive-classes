import { ReactiveClass } from "../reactive-class/reactive-class";

export type RHArguments<A> = A extends undefined ? [] : [() => A];

export abstract class ReactiveHook<A = undefined> extends ReactiveClass {
  private argsGetter!: () => A;
  protected readonly args!: A;

  constructor(...args: RHArguments<A>) {
    super((self: ReactiveHook<A>) => {
      const [getArgs = () => undefined] = args;
      // @ts-expect-error
      self.argsGetter = getArgs;
    });

    const self = this;

    Object.defineProperty(self, "args", {
      get() {
        return self.argsGetter();
      },
    });
  }
}
