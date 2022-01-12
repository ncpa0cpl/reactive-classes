import { effect } from "..";

export const onUnmount =
  () =>
  <K extends string | symbol>(prototype: Record<K, () => any>, key: K) => {
    const impl = prototype[key];

    prototype[key] = function () {
      return impl.bind(this);
    };

    effect(() => [])(prototype, key);
  };
