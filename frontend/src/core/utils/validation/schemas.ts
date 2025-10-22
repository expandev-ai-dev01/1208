/**
 * @utility validationSchemas
 * @summary Common validation schemas using Zod
 * @domain core
 * @category validation
 */

import { z } from 'zod';

export const emailSchema = z.string().email('Email inválido');

export const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número');

export const requiredStringSchema = z.string().min(1, 'Campo obrigatório');

export const optionalStringSchema = z.string().optional();

export const positiveNumberSchema = z.number().positive('Deve ser um número positivo');

export const dateSchema = z.string().datetime('Data inválida');
