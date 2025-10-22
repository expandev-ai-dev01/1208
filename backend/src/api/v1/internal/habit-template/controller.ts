/**
 * @api {get} /internal/habit-template List Templates
 * @apiName ListTemplates
 * @apiGroup HabitTemplate
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists all available habit templates
 *
 * @apiSuccess {Array} data Array of templates
 * @apiSuccess {String} data.id Template identifier
 * @apiSuccess {String} data.name Template name
 * @apiSuccess {String} data.description Template description
 * @apiSuccess {String} data.frequencyType Frequency type
 * @apiSuccess {Number} data.frequencyValue Frequency value
 * @apiSuccess {String} data.idealTime Ideal time
 * @apiSuccess {String} data.category Category
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse } from '@/utils/response';
import { templateList } from '@/services/habit';

export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const templates = templateList();
    res.json(successResponse(templates));
  } catch (error: any) {
    next(error);
  }
}

/**
 * @api {get} /internal/habit-template/:id Get Template
 * @apiName GetTemplate
 * @apiGroup HabitTemplate
 * @apiVersion 1.0.0
 *
 * @apiDescription Gets a specific template by ID
 *
 * @apiParam {String} id Template identifier
 *
 * @apiSuccess {Object} data Template details
 *
 * @apiError {String} NotFound Template not found
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { templateGet } = await import('@/services/habit');
    const template = templateGet(req.params.id);
    res.json(successResponse(template));
  } catch (error: any) {
    if (error.message.includes('não está disponível')) {
      res.status(404).json(errorResponse(error.message, 'NOT_FOUND'));
    } else {
      next(error);
    }
  }
}
