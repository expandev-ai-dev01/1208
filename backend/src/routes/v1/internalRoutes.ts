/**
 * @module routes/v1/internalRoutes
 * @summary Internal (authenticated) API routes configuration
 */

import { Router } from 'express';
import * as habitController from '@/api/v1/internal/habit/controller';
import * as habitTemplateController from '@/api/v1/internal/habit-template/controller';
import * as habitCompletionController from '@/api/v1/internal/habit-completion/controller';

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

// Habit completion routes
router.post('/habit-completion', habitCompletionController.createHandler);
router.delete('/habit-completion/:id', habitCompletionController.deleteHandler);
router.get('/habit-completion/history/:habitId', habitCompletionController.historyHandler);
router.put('/habit-completion/:id/notes', habitCompletionController.updateNotesHandler);

export default router;
