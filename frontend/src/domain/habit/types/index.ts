/**
 * @module domain/habit/types
 * @summary Type definitions for habit domain
 */

export type FrequencyType = 'daily' | 'weekly' | 'monthly';
export type HabitStatus = 'active' | 'inactive';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  frequencyType: FrequencyType;
  frequencyValue: number;
  idealTime: string | null;
  creationDate: string;
  status: HabitStatus;
  categoryId: string | null;
  lastUpdateDate?: string;
}

export interface HabitTemplate {
  id: string;
  name: string;
  description: string | null;
  frequencyType: FrequencyType;
  frequencyValue: number;
  idealTime: string | null;
  category: string | null;
}

export interface CreateHabitDto {
  name: string;
  description?: string | null;
  frequencyType: FrequencyType;
  frequencyValue: number;
  idealTime?: string | null;
  categoryId?: string | null;
}

export interface UpdateHabitDto {
  name?: string;
  description?: string | null;
  frequencyType?: FrequencyType;
  frequencyValue?: number;
  idealTime?: string | null;
  status?: HabitStatus;
  categoryId?: string | null;
}
