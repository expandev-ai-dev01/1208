/**
 * @module services/habitCompletion/completionLogic
 * @summary Business logic for habit completion management
 */

import { v4 as uuidv4 } from 'uuid';
import {
  CompletionEntity,
  CompletionCreateRequest,
  CompletionDeleteRequest,
  CompletionHistoryRequest,
  CompletionUpdateNotesRequest,
} from './completionTypes';
import { habitGet } from '../habit/habitLogic';

const completions: CompletionEntity[] = [];

/**
 * @summary
 * Validates if completion date is not in the future
 *
 * @function validateCompletionDate
 * @module services/habitCompletion/completionLogic
 *
 * @param {string} completionDate - Date to validate
 * @param {string} completionTime - Time to validate
 *
 * @throws {Error} When date/time is in the future
 */
function validateCompletionDate(completionDate: string, completionTime: string): void {
  const completionDateTime = new Date(`${completionDate}T${completionTime}:00`);
  const now = new Date();

  if (completionDateTime > now) {
    throw new Error('Não é possível registrar conclusões com data futura');
  }
}

/**
 * @summary
 * Validates if completion can be deleted (within 7 days)
 *
 * @function validateDeletionPeriod
 * @module services/habitCompletion/completionLogic
 *
 * @param {Date} registrationDate - Registration date
 *
 * @throws {Error} When period exceeded
 */
function validateDeletionPeriod(registrationDate: Date): void {
  const now = new Date();
  const diffInMs = now.getTime() - registrationDate.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays > 7) {
    throw new Error('Não é possível desmarcar conclusões registradas há mais de 7 dias');
  }
}

/**
 * @summary
 * Validates if notes can be edited (within 24 hours)
 *
 * @function validateNotesEditPeriod
 * @module services/habitCompletion/completionLogic
 *
 * @param {Date} registrationDate - Registration date
 *
 * @throws {Error} When period exceeded
 */
function validateNotesEditPeriod(registrationDate: Date): void {
  const now = new Date();
  const diffInMs = now.getTime() - registrationDate.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (diffInHours > 24) {
    throw new Error('Não é possível editar observações registradas há mais de 24 horas');
  }
}

/**
 * @summary
 * Creates a new habit completion
 *
 * @function completionCreate
 * @module services/habitCompletion/completionLogic
 *
 * @param {CompletionCreateRequest} params - Completion creation parameters
 *
 * @returns {CompletionEntity} Created completion entity
 *
 * @throws {Error} When validation fails or habit not found
 */
export function completionCreate(params: CompletionCreateRequest): CompletionEntity {
  const habit = habitGet(params.habitId, params.userId);

  validateCompletionDate(params.completionDate, params.completionTime);

  const completion: CompletionEntity = {
    id: uuidv4(),
    habitId: params.habitId,
    userId: params.userId,
    completionDate: params.completionDate,
    completionTime: params.completionTime,
    registrationDateTime: new Date(),
    notes: params.notes || null,
    deleted: false,
    deletionDateTime: null,
    deletionReason: null,
  };

  completions.push(completion);
  return completion;
}

/**
 * @summary
 * Deletes (unmarks) a habit completion
 *
 * @function completionDelete
 * @module services/habitCompletion/completionLogic
 *
 * @param {CompletionDeleteRequest} params - Deletion parameters
 *
 * @returns {void}
 *
 * @throws {Error} When completion not found, period exceeded, or user doesn't own it
 */
export function completionDelete(params: CompletionDeleteRequest): void {
  const completion = completions.find((c) => c.id === params.id && !c.deleted);

  if (!completion) {
    throw new Error('A conclusão selecionada não existe ou já foi desmarcada');
  }

  if (completion.userId !== params.userId) {
    throw new Error('Você não tem permissão para desmarcar esta conclusão');
  }

  validateDeletionPeriod(completion.registrationDateTime);

  completion.deleted = true;
  completion.deletionDateTime = new Date();
  completion.deletionReason = params.reason || null;
}

/**
 * @summary
 * Gets completion history for a habit
 *
 * @function completionHistory
 * @module services/habitCompletion/completionLogic
 *
 * @param {CompletionHistoryRequest} params - History request parameters
 *
 * @returns {CompletionEntity[]} Array of completions
 *
 * @throws {Error} When habit not found or user doesn't own it
 */
export function completionHistory(params: CompletionHistoryRequest): CompletionEntity[] {
  const habit = habitGet(params.habitId, params.userId);

  let history = completions.filter(
    (c) => c.habitId === params.habitId && c.userId === params.userId
  );

  if (params.startDate) {
    history = history.filter((c) => c.completionDate >= params.startDate!);
  }

  if (params.endDate) {
    history = history.filter((c) => c.completionDate <= params.endDate!);
  }

  if (!params.startDate && !params.endDate) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    history = history.filter((c) => c.completionDate >= thirtyDaysAgoStr);
  }

  return history.sort((a, b) => {
    const dateA = new Date(`${a.completionDate}T${a.completionTime}`);
    const dateB = new Date(`${b.completionDate}T${b.completionTime}`);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * @summary
 * Updates notes for a completion
 *
 * @function completionUpdateNotes
 * @module services/habitCompletion/completionLogic
 *
 * @param {CompletionUpdateNotesRequest} params - Update notes parameters
 *
 * @returns {CompletionEntity} Updated completion entity
 *
 * @throws {Error} When completion not found, period exceeded, or user doesn't own it
 */
export function completionUpdateNotes(params: CompletionUpdateNotesRequest): CompletionEntity {
  const completion = completions.find((c) => c.id === params.id && !c.deleted);

  if (!completion) {
    throw new Error('A conclusão selecionada não existe ou foi removida');
  }

  if (completion.userId !== params.userId) {
    throw new Error('Você não tem permissão para adicionar observações a esta conclusão');
  }

  validateNotesEditPeriod(completion.registrationDateTime);

  completion.notes = params.notes;

  return completion;
}
