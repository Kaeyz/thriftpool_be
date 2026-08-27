import { SortDirection } from "./types";

export const buildSortObject = (sortKey?: string, sortDir?: SortDirection, path: Record<string, string> = {}) => {
  let finalKey = "createdAt";
  let finalDir: 1 | -1 = -1;

  if (sortKey) finalKey = sortKey;
  if (sortDir) finalDir = sortDir.toLowerCase() === "asc" ? 1 : -1;

  return { [path[finalKey] || finalKey]: finalDir };
};

export const buildPagination = (page?: number, limit?: number) => {
  const currentPage = page && page > 0 ? page : 1;
  const currentLimit = limit && limit > 0 ? limit : 10;

  const skip = (currentPage - 1) * currentLimit;

  return {
    page: currentPage,
    limit: currentLimit,
    skip,
  };
};
