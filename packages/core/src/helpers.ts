export const sortObject = (value: object): object => {
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }

  if (value === null || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => [key, sortObject(val)])
  );
};
