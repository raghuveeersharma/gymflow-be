import type { PaginationMeta, PaginationQuery, PaginatedResponse } from '../types/common.types';

interface RawQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: string;
}

export const parsePagination = (query: RawQuery): PaginationQuery => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  const skip = (page - 1) * limit;
  const sort = query.sort || 'createdAt';
  const order = query.order === 'asc' ? 'asc' : 'desc';

  return { page, limit, skip, sort, order };
};

export const buildPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(total / limit);

  const meta: PaginationMeta = {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return { data, meta };
};
