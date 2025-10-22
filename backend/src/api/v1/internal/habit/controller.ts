/**
 * @api {get} /internal/habit List Habits
 * @apiName ListHabits
 * @apiGroup Habit
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists all habits for the authenticated user
 *
 * @apiParam {String} [status] Optional status filter (active/inactive)
 *
 * @apiSuccess {Array} data Array of habits
 * @apiSuccess {String} data.id Habit identifier
 * @apiSuccess {String} data.name Habit name
 * @apiSuccess {String} data.description Habit description
 * @apiSuccess {String} data.frequencyType Frequency type
 * @apiSuccess {Number} data.frequencyValue Frequency value
 * @apiSuccess {String} data.idealTime Ideal time
 * @apiSuccess {String} data.status Habit status
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} UnauthorizedError User not authenticated
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { habitList, HabitStatus } from '@/services/habit';

const querySchema = z.object({
  status: z.enum(['active', 'inactive']).optional(),
});

export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = querySchema.parse(req.query);
    const userId = 'mock-user-id';

    const habits = habitList(userId, query.status as HabitStatus | undefined);

    res.json(successResponse(habits));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {post} /internal/habit Create Habit
 * @apiName CreateHabit
 * @apiGroup Habit
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new habit
 *
 * @apiParam {String} name Habit name (3-50 characters)
 * @apiParam {String} [description] Habit description (max 200 characters)
 * @apiParam {String} frequencyType Frequency type (daily/weekly/monthly)
 * @apiParam {Number} frequencyValue Frequency value
 * @apiParam {String} [idealTime] Ideal time (HH:MM format)
 * @apiParam {String} [categoryId] Category identifier
 *
 * @apiSuccess {Object} data Created habit
 * @apiSuccess {String} data.id Habit identifier
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} LimitReached Maximum of 10 active habits reached
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const bodySchema = z.object({
      name: z
        .string()
        .min(3, 'O nome do hábito deve ter pelo menos 3 caracteres')
        .max(50, 'O nome do hábito deve ter no máximo 50 caracteres')
        .refine(
          (val) => val.trim().length > 0,
          'O nome do hábito não pode conter apenas espaços em branco'
        ),
      description: z
        .string()
        .max(200, 'A descrição deve ter no máximo 200 caracteres')
        .nullable()
        .optional(),
      frequencyType: z.enum(['daily', 'weekly', 'monthly'], {
        errorMap: () => ({
          message: 'Selecione uma frequência válida (diária, semanal ou mensal)',
        }),
      }),
      frequencyValue: z.number().int().min(1, 'O valor de frequência deve ser no mínimo 1'),
      idealTime: z
        .string()
        .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'O horário deve estar no formato HH:MM')
        .nullable()
        .optional(),
      categoryId: z.string().uuid().nullable().optional(),
    });

    const body = bodySchema.parse(req.body);
    const userId = 'mock-user-id';

    const { habitCreate } = await import('@/services/habit');
    const habit = habitCreate({
      userId,
      name: body.name,
      description: body.description || null,
      frequencyType: body.frequencyType as any,
      frequencyValue: body.frequencyValue,
      idealTime: body.idealTime || null,
      categoryId: body.categoryId || null,
    });

    res.status(201).json(successResponse(habit));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else if (error.message.includes('limite')) {
      res.status(400).json(errorResponse(error.message, 'LIMIT_REACHED'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {get} /internal/habit/:id Get Habit
 * @apiName GetHabit
 * @apiGroup Habit
 * @apiVersion 1.0.0
 *
 * @apiDescription Gets a specific habit by ID
 *
 * @apiParam {String} id Habit identifier
 *
 * @apiSuccess {Object} data Habit details
 *
 * @apiError {String} NotFound Habit not found
 * @apiError {String} Forbidden User doesn't own this habit
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const paramsSchema = z.object({
      id: z.string().uuid('ID inválido'),
    });

    const params = paramsSchema.parse(req.params);
    const userId = 'mock-user-id';

    const { habitGet } = await import('@/services/habit');
    const habit = habitGet(params.id, userId);

    res.json(successResponse(habit));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else if (error.message.includes('não existe')) {
      res.status(404).json(errorResponse(error.message, 'NOT_FOUND'));
    } else if (error.message.includes('permissão')) {
      res.status(403).json(errorResponse(error.message, 'FORBIDDEN'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {put} /internal/habit/:id Update Habit
 * @apiName UpdateHabit
 * @apiGroup Habit
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing habit
 *
 * @apiParam {String} id Habit identifier
 * @apiParam {String} [name] Habit name
 * @apiParam {String} [description] Habit description
 * @apiParam {String} [frequencyType] Frequency type
 * @apiParam {Number} [frequencyValue] Frequency value
 * @apiParam {String} [idealTime] Ideal time
 * @apiParam {String} [status] Habit status
 * @apiParam {String} [categoryId] Category identifier
 *
 * @apiSuccess {Object} data Updated habit
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} NotFound Habit not found
 * @apiError {String} LimitReached Cannot activate habit (limit reached)
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const paramsSchema = z.object({
      id: z.string().uuid('ID inválido'),
    });

    const bodySchema = z.object({
      name: z.string().min(3).max(50).optional(),
      description: z.string().max(200).nullable().optional(),
      frequencyType: z.enum(['daily', 'weekly', 'monthly']).optional(),
      frequencyValue: z.number().int().min(1).optional(),
      idealTime: z
        .string()
        .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
        .nullable()
        .optional(),
      status: z.enum(['active', 'inactive']).optional(),
      categoryId: z.string().uuid().nullable().optional(),
    });

    const params = paramsSchema.parse(req.params);
    const body = bodySchema.parse(req.body);
    const userId = 'mock-user-id';

    const { habitUpdate } = await import('@/services/habit');
    const habit = habitUpdate({
      id: params.id,
      userId,
      ...body,
    } as any);

    res.json(successResponse(habit));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else if (error.message.includes('não existe')) {
      res.status(404).json(errorResponse(error.message, 'NOT_FOUND'));
    } else if (error.message.includes('limite')) {
      res.status(400).json(errorResponse(error.message, 'LIMIT_REACHED'));
    } else if (error.message.includes('permissão')) {
      res.status(403).json(errorResponse(error.message, 'FORBIDDEN'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {delete} /internal/habit/:id Delete Habit
 * @apiName DeleteHabit
 * @apiGroup Habit
 * @apiVersion 1.0.0
 *
 * @apiDescription Deletes a habit
 *
 * @apiParam {String} id Habit identifier
 *
 * @apiSuccess {Object} data Success message
 *
 * @apiError {String} NotFound Habit not found
 * @apiError {String} Forbidden User doesn't own this habit
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const paramsSchema = z.object({
      id: z.string().uuid('ID inválido'),
    });

    const params = paramsSchema.parse(req.params);
    const userId = 'mock-user-id';

    const { habitDelete } = await import('@/services/habit');
    habitDelete(params.id, userId);

    res.json(successResponse({ message: 'Hábito excluído com sucesso' }));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else if (error.message.includes('não existe')) {
      res.status(404).json(errorResponse(error.message, 'NOT_FOUND'));
    } else if (error.message.includes('permissão')) {
      res.status(403).json(errorResponse(error.message, 'FORBIDDEN'));
    } else {
      next(error);
    }
  }
}
