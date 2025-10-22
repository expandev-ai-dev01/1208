/**
 * @module utils/response
 * @description Response formatting utilities
 */

/**
 * @interface SuccessResponse
 * @description Standard success response format
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
  metadata?: {
    page?: number;
    pageSize?: number;
    total?: number;
    timestamp: string;
  };
}

/**
 * @interface ListResponse
 * @description Standard list response format
 */
export interface ListResponse<T> {
  success: true;
  data: T[];
  metadata: {
    page: number;
    pageSize: number;
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
    timestamp: string;
  };
}

/**
 * @summary
 * Creates a standardized success response
 *
 * @function successResponse
 * @module utils/response
 *
 * @param {T} data - Response data
 * @param {object} [metadata] - Optional metadata
 *
 * @returns {SuccessResponse<T>} Formatted success response
 */
export function successResponse<T>(data: T, metadata?: any): SuccessResponse<T> {
  return {
    success: true,
    data,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * @summary
 * Creates a standardized list response with pagination
 *
 * @function listResponse
 * @module utils/response
 *
 * @param {T[]} data - Array of items
 * @param {number} page - Current page number
 * @param {number} pageSize - Items per page
 * @param {number} total - Total number of items
 *
 * @returns {ListResponse<T>} Formatted list response
 */
export function listResponse<T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number
): ListResponse<T> {
  return {
    success: true,
    data,
    metadata: {
      page,
      pageSize,
      total,
      hasNext: page * pageSize < total,
      hasPrevious: page > 1,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * @summary
 * Creates a standardized error response
 *
 * @function errorResponse
 * @module utils/response
 *
 * @param {string} message - Error message
 * @param {string} [code] - Error code
 * @param {any} [details] - Additional error details
 *
 * @returns {object} Formatted error response
 */
export function errorResponse(message: string, code?: string, details?: any) {
  return {
    success: false,
    error: {
      code: code || 'ERROR',
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}
