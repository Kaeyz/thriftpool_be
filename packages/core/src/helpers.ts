export const sortObject = (value: object): object => {
  return Object.fromEntries(
    Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => [key, sortObject(value)])
  );
};
