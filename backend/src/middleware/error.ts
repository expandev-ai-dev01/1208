/**
 * @module middleware/error
 * @description Error handling middleware
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * @interface ErrorResponse
 * @description Standard error response format
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

/**
 * @summary
 * Global error handling middleware
 *
 * @function errorMiddleware
 * @module middleware/error
 *
 * @param {Error} error - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Express next function
 *
 * @returns {void}
 */
export function errorMiddleware(error: any, req: Request, res: Response, next: NextFunction): void {
  console.error('Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.errors,
      },
      timestamp: new Date().toISOString(),
    } as ErrorResponse);
    return;
  }

  // Custom application errors
  if (error.statusCode) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code || 'APPLICATION_ERROR',
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    } as ErrorResponse);
    return;
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
    timestamp: new Date().toISOString(),
  } as ErrorResponse);
}
