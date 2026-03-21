export interface JwtPayload {
  userId: string;
  email: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
  sort: string;
  order: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
