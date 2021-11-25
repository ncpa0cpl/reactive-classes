declare module "observable-slim" {
  class Observable {
    static create<T>(
      obj: T,
      timeout: boolean,
      onChange: (change: {
        type: string;
        target: object;
        property: unknown;
        newValue: unknown;
        previousValue: unknown;
        currentPath: string;
        jsonPointer: string;
        proxy: Proxy<object>;
      }) => void
    ): T & Observable;

    static pauseChanges(proxy: Observable): void;

    static resumeChanges(proxy: Observable): void;
  }

  export default Observable;
}
