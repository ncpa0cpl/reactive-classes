import { effect } from "..";

export const onMount =
  () =>
  <K extends string | symbol>(prototype: Record<K, () => any>, key: K) => {
    const impl = prototype[key];

    prototype[key] = function () {
      impl.bind(this)();
    };

    effect(() => [])(prototype, key);
  };
