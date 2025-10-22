/**
 * @service habitCompletionService
 * @summary Provides methods for all habit completion-related backend operations using REST.
 * @domain habitCompletion
 * @type rest-service
 */

import { apiClient } from '@/core/lib/api';
import type {
  HabitCompletion,
  CreateCompletionDto,
  UpdateCompletionNotesDto,
  UnmarkCompletionDto,
  CompletionHistoryParams,
} from '../types';

export const habitCompletionService = {
  /**
   * @endpoint POST /v1/internal/habit-completion
   * @summary Marks a habit as completed.
   * @param {CreateCompletionDto} data - Completion data.
   * @returns {Promise<HabitCompletion>} The created completion record.
   */
  async create(data: CreateCompletionDto): Promise<HabitCompletion> {
    const response = await apiClient.post('/v1/internal/habit-completion', data);
    return response.data;
  },

  /**
   * @endpoint DELETE /v1/internal/habit-completion/{id}
   * @summary Unmarks a habit completion.
   * @param {string} id - Completion identifier.
   * @param {UnmarkCompletionDto} data - Optional reason for unmarking.
   * @returns {Promise<void>}
   */
  async delete(id: string, data?: UnmarkCompletionDto): Promise<void> {
    await apiClient.delete(`/v1/internal/habit-completion/${id}`, { data });
  },

  /**
   * @endpoint GET /v1/internal/habit-completion/history/{habitId}
   * @summary Gets completion history for a habit.
   * @param {CompletionHistoryParams} params - History parameters.
   * @returns {Promise<HabitCompletion[]>} Array of completions.
   */
  async getHistory(params: CompletionHistoryParams): Promise<HabitCompletion[]> {
    const { habitId, startDate, endDate } = params;
    const queryParams: any = {};
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;

    const response = await apiClient.get(`/v1/internal/habit-completion/history/${habitId}`, {
      params: queryParams,
    });
    return response.data;
  },

  /**
   * @endpoint PUT /v1/internal/habit-completion/{id}/notes
   * @summary Updates notes for a completion.
   * @param {string} id - Completion identifier.
   * @param {UpdateCompletionNotesDto} data - Notes data.
   * @returns {Promise<HabitCompletion>} The updated completion.
   */
  async updateNotes(id: string, data: UpdateCompletionNotesDto): Promise<HabitCompletion> {
    const response = await apiClient.put(`/v1/internal/habit-completion/${id}/notes`, data);
    return response.data;
  },
};
