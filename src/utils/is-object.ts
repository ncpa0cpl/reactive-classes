export const isObject = (o: unknown): o is object =>
  typeof o === "object" && o !== null;
