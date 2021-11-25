export const extractPath = (obj: object, path: string[]) => {
  for (const part of path) {
    if (part in obj) {
      // @ts-expect-error
      obj = obj[part];
    } else {
      return undefined;
    }
  }

  return obj;
};
