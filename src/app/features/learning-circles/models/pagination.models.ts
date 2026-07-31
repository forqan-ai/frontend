export interface PaginationQuery {
  pageNumber: number;
  pageSize: number;
}

export interface SearchPaginationQuery extends PaginationQuery {
  search?: string;
}

export interface RequiredSearchPaginationQuery extends PaginationQuery {
  search: string;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
