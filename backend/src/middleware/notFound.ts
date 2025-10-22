/**
 * @module middleware/notFound
 * @description 404 Not Found middleware
 */

import { Request, Response } from 'express';

/**
 * @summary
 * Handles 404 Not Found errors
 *
 * @function notFoundMiddleware
 * @module middleware/notFound
 *
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 *
 * @returns {void}
 */
export function notFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
    timestamp: new Date().toISOString(),
  });
}
