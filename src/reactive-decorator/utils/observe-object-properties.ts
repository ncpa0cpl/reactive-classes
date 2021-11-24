const isPrimitive = (v: unknown) => {
  const type = typeof v;

  return ["string", "number", "boolean", "symbol"].some((e) => e === type);
};

export const observeObjectProperties = <O extends object>(
  obj: O,
  onChange: () => void
): O => {
  for (const [key, value] of Object.entries(obj)) {
    let valueContainer = value;
    Object.defineProperty(obj, key, {
      get() {
        return valueContainer;
      },
      set(newValue) {
        const hasChanged = isPrimitive(newValue)
          ? newValue !== valueContainer
          : true;

        valueContainer = newValue;

        if (hasChanged) {
          onChange();
        }
      },
    });
  }

  return obj;
};
