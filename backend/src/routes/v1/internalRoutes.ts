/**
 * @module routes/v1/internalRoutes
 * @description Internal (authenticated) API routes configuration
 */

import { Router } from 'express';
import * as habitController from '@/api/v1/internal/habit/controller';
import * as habitTemplateController from '@/api/v1/internal/habit-template/controller';

const router = Router();

// Habit routes
router.get('/habit', habitController.listHandler);
router.post('/habit', habitController.createHandler);
router.get('/habit/:id', habitController.getHandler);
router.put('/habit/:id', habitController.updateHandler);
router.delete('/habit/:id', habitController.deleteHandler);

// Habit template routes
router.get('/habit-template', habitTemplateController.listHandler);
router.get('/habit-template/:id', habitTemplateController.getHandler);

export default router;
