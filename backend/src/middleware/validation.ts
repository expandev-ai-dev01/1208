/**
 * @module middleware/validation
 * @description Request validation middleware
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

/**
 * @summary
 * Creates validation middleware for request body
 *
 * @function validateBody
 * @module middleware/validation
 *
 * @param {ZodSchema} schema - Zod validation schema
 *
 * @returns {Function} Express middleware function
 */
export function validateBody(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * @summary
 * Creates validation middleware for request params
 *
 * @function validateParams
 * @module middleware/validation
 *
 * @param {ZodSchema} schema - Zod validation schema
 *
 * @returns {Function} Express middleware function
 */
export function validateParams(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = await schema.parseAsync(req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * @summary
 * Creates validation middleware for request query
 *
 * @function validateQuery
 * @module middleware/validation
 *
 * @param {ZodSchema} schema - Zod validation schema
 *
 * @returns {Function} Express middleware function
 */
export function validateQuery(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
}
