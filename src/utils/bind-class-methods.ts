export const bindClassMethods = <O extends object>(
  obj: O,
  prototype: object
): O => {
  const ownPropertyNames = Object.getOwnPropertyNames(prototype);

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
