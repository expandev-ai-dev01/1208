/**
 * @api {post} /internal/habit-completion Mark Habit Completion
 * @apiName MarkHabitCompletion
 * @apiGroup HabitCompletion
 * @apiVersion 1.0.0
 *
 * @apiDescription Marks a habit as completed with date, time, and optional notes
 *
 * @apiParam {String} habitId Habit identifier
 * @apiParam {String} [completionDate] Completion date (defaults to current date)
 * @apiParam {String} [completionTime] Completion time (defaults to current time)
 * @apiParam {String} [notes] Optional notes about the completion
 *
 * @apiSuccess {Object} data Created completion record
 * @apiSuccess {String} data.id Completion identifier
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} FutureDate Cannot mark completion with future date
 * @apiError {String} NotFound Habit not found
 * @apiError {String} Forbidden User doesn't own this habit
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { completionCreate } from '@/services/habitCompletion';

const bodySchema = z
  .object({
    habitId: z.string().uuid('ID do hábito inválido'),
    completionDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
      .optional()
      .refine((date) => {
        if (!date) return true;
        const completionDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return completionDate <= today;
      }, 'Não é possível registrar conclusões com data futura'),
    completionTime: z
      .string()
      .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Horário deve estar no formato HH:MM')
      .optional(),
    notes: z.string().max(500, 'As observações não podem exceder 500 caracteres').optional(),
  })
  .refine((data) => {
    if (!data.completionTime || !data.completionDate) return true;
    const completionDate = new Date(data.completionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (completionDate.getTime() === today.getTime()) {
      const [hours, minutes] = data.completionTime.split(':').map(Number);
      const now = new Date();
      const completionDateTime = new Date();
      completionDateTime.setHours(hours, minutes, 0, 0);
      return completionDateTime <= now;
    }
    return true;
  }, 'Se a data for a atual, a hora não pode ser futura');

export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = bodySchema.parse(req.body);
    const userId = 'mock-user-id';

    const completion = await completionCreate({
      userId,
      habitId: body.habitId,
      completionDate: body.completionDate || new Date().toISOString().split('T')[0],
      completionTime:
        body.completionTime || new Date().toTimeString().split(' ')[0].substring(0, 5),
      notes: body.notes || null,
    });

    res.status(201).json(successResponse(completion));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else if (error.message.includes('não existe')) {
      res.status(404).json(errorResponse(error.message, 'NOT_FOUND'));
    } else if (error.message.includes('permissão')) {
      res.status(403).json(errorResponse(error.message, 'FORBIDDEN'));
    } else if (error.message.includes('futura')) {
      res.status(400).json(errorResponse(error.message, 'FUTURE_DATE'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {delete} /internal/habit-completion/:id Unmark Habit Completion
 * @apiName UnmarkHabitCompletion
 * @apiGroup HabitCompletion
 * @apiVersion 1.0.0
 *
 * @apiDescription Unmarks a habit completion (only within 7 days)
 *
 * @apiParam {String} id Completion identifier
 * @apiParam {String} [reason] Optional reason for unmarking
 *
 * @apiSuccess {Object} data Success message
 *
 * @apiError {String} NotFound Completion not found
 * @apiError {String} Forbidden User doesn't own this completion
 * @apiError {String} PeriodExceeded Cannot unmark after 7 days
 */

const deleteBodySchema = z.object({
  reason: z.string().max(200, 'O motivo não pode exceder 200 caracteres').optional(),
});

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
    const body = deleteBodySchema.parse(req.body);
    const userId = 'mock-user-id';

    const { completionDelete } = await import('@/services/habitCompletion');
    await completionDelete({
      id: params.id,
      userId,
      reason: body.reason || null,
    });

    res.json(successResponse({ message: 'Conclusão desmarcada com sucesso' }));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else if (error.message.includes('não existe')) {
      res.status(404).json(errorResponse(error.message, 'NOT_FOUND'));
    } else if (error.message.includes('permissão')) {
      res.status(403).json(errorResponse(error.message, 'FORBIDDEN'));
    } else if (error.message.includes('7 dias')) {
      res.status(400).json(errorResponse(error.message, 'PERIOD_EXCEEDED'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {get} /internal/habit-completion/history/:habitId Get Completion History
 * @apiName GetCompletionHistory
 * @apiGroup HabitCompletion
 * @apiVersion 1.0.0
 *
 * @apiDescription Gets completion history for a habit with optional date filters
 *
 * @apiParam {String} habitId Habit identifier
 * @apiParam {String} [startDate] Start date filter (YYYY-MM-DD)
 * @apiParam {String} [endDate] End date filter (YYYY-MM-DD)
 *
 * @apiSuccess {Array} data Array of completions
 *
 * @apiError {String} NotFound Habit not found
 * @apiError {String} Forbidden User doesn't own this habit
 * @apiError {String} ValidationError Invalid date range
 */

export async function historyHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const paramsSchema = z.object({
      habitId: z.string().uuid('ID do hábito inválido'),
    });

    const querySchema = z
      .object({
        startDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inicial deve estar no formato YYYY-MM-DD')
          .optional(),
        endDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data final deve estar no formato YYYY-MM-DD')
          .optional(),
      })
      .refine((data) => {
        if (data.startDate && data.endDate) {
          return new Date(data.startDate) <= new Date(data.endDate);
        }
        return true;
      }, 'A data final não pode ser anterior à data inicial');

    const params = paramsSchema.parse(req.params);
    const query = querySchema.parse(req.query);
    const userId = 'mock-user-id';

    const { completionHistory } = await import('@/services/habitCompletion');
    const history = await completionHistory({
      userId,
      habitId: params.habitId,
      startDate: query.startDate || null,
      endDate: query.endDate || null,
    });

    res.json(successResponse(history));
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
 * @api {put} /internal/habit-completion/:id/notes Update Completion Notes
 * @apiName UpdateCompletionNotes
 * @apiGroup HabitCompletion
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates notes for a completion (only within 24 hours)
 *
 * @apiParam {String} id Completion identifier
 * @apiParam {String} notes Notes text
 *
 * @apiSuccess {Object} data Updated completion
 *
 * @apiError {String} NotFound Completion not found
 * @apiError {String} Forbidden User doesn't own this completion
 * @apiError {String} PeriodExceeded Cannot edit after 24 hours
 * @apiError {String} ValidationError Notes too long or empty
 */

export async function updateNotesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const paramsSchema = z.object({
      id: z.string().uuid('ID inválido'),
    });

    const bodySchema = z.object({
      notes: z
        .string()
        .min(1, 'A observação não pode estar vazia')
        .max(500, 'A observação não pode exceder 500 caracteres')
        .refine(
          (val) => val.trim().length > 0,
          'A observação não pode conter apenas espaços em branco'
        ),
    });

    const params = paramsSchema.parse(req.params);
    const body = bodySchema.parse(req.body);
    const userId = 'mock-user-id';

    const { completionUpdateNotes } = await import('@/services/habitCompletion');
    const completion = await completionUpdateNotes({
      id: params.id,
      userId,
      notes: body.notes,
    });

    res.json(successResponse(completion));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR'));
    } else if (error.message.includes('não existe')) {
      res.status(404).json(errorResponse(error.message, 'NOT_FOUND'));
    } else if (error.message.includes('permissão')) {
      res.status(403).json(errorResponse(error.message, 'FORBIDDEN'));
    } else if (error.message.includes('24 horas')) {
      res.status(400).json(errorResponse(error.message, 'PERIOD_EXCEEDED'));
    } else {
      next(error);
    }
  }
}
