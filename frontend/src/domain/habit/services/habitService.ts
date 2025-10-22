/**
 * @service habitService
 * @summary Provides methods for all habit-related backend operations using REST.
 * @domain habit
 * @type rest-service
 */

import { apiClient } from '@/core/lib/api';
import type { Habit, HabitTemplate, CreateHabitDto, UpdateHabitDto, HabitStatus } from '../types';

export const habitService = {
  /**
   * @endpoint GET /v1/internal/habit
   * @summary Fetches a list of habits with optional status filter.
   * @param {HabitStatus} status - Optional status filter.
   * @returns {Promise<Habit[]>} A list of habits.
   */
  async list(status?: HabitStatus): Promise<Habit[]> {
    const params = status ? { status } : {};
    const response = await apiClient.get('/v1/internal/habit', { params });
    return response.data;
  },

  /**
   * @endpoint GET /v1/internal/habit/{id}
   * @summary Fetches a single habit by its ID.
   * @param {string} id - The ID of the habit.
   * @returns {Promise<Habit>} The habit object.
   */
  async getById(id: string): Promise<Habit> {
    const response = await apiClient.get(`/v1/internal/habit/${id}`);
    return response.data;
  },

  /**
   * @endpoint POST /v1/internal/habit
   * @summary Creates a new habit.
   * @param {CreateHabitDto} data - The data for the new habit.
   * @returns {Promise<Habit>} The newly created habit.
   */
  async create(data: CreateHabitDto): Promise<Habit> {
    const response = await apiClient.post('/v1/internal/habit', data);
    return response.data;
  },

  /**
   * @endpoint PUT /v1/internal/habit/{id}
   * @summary Updates an existing habit.
   * @param {string} id - The ID of the habit to update.
   * @param {UpdateHabitDto} data - The data to update.
   * @returns {Promise<Habit>} The updated habit.
   */
  async update(id: string, data: UpdateHabitDto): Promise<Habit> {
    const response = await apiClient.put(`/v1/internal/habit/${id}`, data);
    return response.data;
  },

  /**
   * @endpoint DELETE /v1/internal/habit/{id}
   * @summary Deletes a habit.
   * @param {string} id - The ID of the habit to delete.
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/v1/internal/habit/${id}`);
  },
};

export const habitTemplateService = {
  /**
   * @endpoint GET /v1/internal/habit-template
   * @summary Fetches all available habit templates.
   * @returns {Promise<HabitTemplate[]>} A list of templates.
   */
  async list(): Promise<HabitTemplate[]> {
    const response = await apiClient.get('/v1/internal/habit-template');
    return response.data;
  },

  /**
   * @endpoint GET /v1/internal/habit-template/{id}
   * @summary Fetches a specific template by ID.
   * @param {string} id - Template identifier.
   * @returns {Promise<HabitTemplate>} The template details.
   */
  async getById(id: string): Promise<HabitTemplate> {
    const response = await apiClient.get(`/v1/internal/habit-template/${id}`);
    return response.data;
  },
};
