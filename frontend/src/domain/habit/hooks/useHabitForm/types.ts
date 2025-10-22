/**
 * @module domain/habit/hooks/useHabitForm/types
 * @summary Type definitions for useHabitForm hook
 */

import type { CreateHabitDto, UpdateHabitDto, Habit } from '../../types';

export interface UseHabitFormOptions {
  habitId?: string;
  onSuccess?: (habit: Habit) => void;
  onError?: (error: any) => void;
}

export interface UseHabitFormReturn {
  habit: Habit | null;
  isLoading: boolean;
  isSaving: boolean;
  error: any;
  createHabit: (data: CreateHabitDto) => Promise<Habit>;
  updateHabit: (data: UpdateHabitDto) => Promise<Habit>;
}
