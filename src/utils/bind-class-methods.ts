export const bindClassMethods = <O extends object>(obj: O): O => {
  const ownPropertyNames = Object.getOwnPropertyNames(
    Object.getPrototypeOf(obj)
  );

  for (const property of ownPropertyNames) {
    // @ts-expect-error
    const method: unknown = obj[property];

    if (typeof method === "function") {
      // @ts-expect-error
      obj[property] = method.bind(obj);
    }
  }

  return obj;
};
