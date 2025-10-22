/**
 * @module utils/zodValidation
 * @description Zod validation utilities and custom validators
 */

import { z } from 'zod';

/**
 * @summary
 * Validates a string field (1-255 characters)
 */
export const zString = z.string().min(1).max(255);

/**
 * @summary
 * Validates a nullable string field
 */
export const zNullableString = z.string().max(255).nullable();

/**
 * @summary
 * Validates a name field (1-100 characters)
 */
export const zName = z.string().min(1).max(100);

/**
 * @summary
 * Validates a description field (nullable, max 500 characters)
 */
export const zNullableDescription = z.string().max(500).nullable();

/**
 * @summary
 * Validates a foreign key (positive integer)
 */
export const zFK = z.number().int().positive();

/**
 * @summary
 * Validates a nullable foreign key
 */
export const zNullableFK = z.number().int().positive().nullable();

/**
 * @summary
 * Validates a bit/boolean field (0 or 1)
 */
export const zBit = z.union([z.literal(0), z.literal(1)]);

/**
 * @summary
 * Validates a date string in ISO format
 */
export const zDateString = z.string().datetime();

/**
 * @summary
 * Validates an email address
 */
export const zEmail = z.string().email().max(255);

/**
 * @summary
 * Validates a positive integer
 */
export const zPositiveInt = z.number().int().positive();

/**
 * @summary
 * Validates a non-negative integer
 */
export const zNonNegativeInt = z.number().int().nonnegative();

/**
 * @summary
 * Validates an ID parameter (coerced to positive integer)
 */
export const zIdParam = z.object({
  id: z.coerce.number().int().positive(),
});
