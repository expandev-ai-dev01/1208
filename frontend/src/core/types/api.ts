/**
 * @module core/types/api
 * @summary Common API type definitions
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  status?: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}
