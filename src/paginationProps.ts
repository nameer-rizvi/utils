export interface PaginationProps {
  total: number;
  size: number;
  pages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
  startIndex: number;
  endIndex: number;
}

/**
 * Calculates pagination properties for a given total, page size, and current page.
 * Page and size are clamped to valid ranges automatically.
 * `startIndex` and `endIndex` are zero-based and can be used directly for slicing, MongoDB `skip`/`limit` or MySQL `OFFSET`/`LIMIT`.
 * @example
 * paginationProps(100, 10, 1)
 * // { total: 100, size: 10, pages: 10, page: 1, hasNextPage: true, hasPrevPage: false,
 * //   nextPage: 2, prevPage: null, startIndex: 0, endIndex: 9 }
 *
 * paginationProps(100, 10, 5)
 * // { total: 100, size: 10, pages: 10, page: 5, hasNextPage: true, hasPrevPage: true,
 * //   nextPage: 6, prevPage: 4, startIndex: 40, endIndex: 49 }
 *
 * paginationProps(100, 10, 10)
 * // { total: 100, size: 10, pages: 10, page: 10, hasNextPage: false, hasPrevPage: true,
 * //   nextPage: null, prevPage: 9, startIndex: 90, endIndex: 99 }
 *
 * paginationProps(5, 10, 1)
 * // { total: 5, size: 10, pages: 1, page: 1, hasNextPage: false, hasPrevPage: false,
 * //   nextPage: null, prevPage: null, startIndex: 0, endIndex: 4 }
 */
export function paginationProps(
  total: number,
  pageSize: number,
  currentPage: number,
): PaginationProps {
  const size = Math.max(1, Math.floor(pageSize));

  const pages = Math.max(1, Math.ceil(total / size));

  const page = Math.min(Math.max(1, Math.floor(currentPage)), pages);

  const hasNextPage = page < pages;

  const hasPrevPage = page > 1;

  const startIndex = (page - 1) * size;

  const endIndex = Math.min(startIndex + size - 1, total - 1);

  return {
    total,
    size,
    pages,
    page,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
    startIndex,
    endIndex,
  };
}
