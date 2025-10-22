/**
 * @module domain/habit/hooks/useHabitList/types
 * @summary Type definitions for useHabitList hook
 */

import type { Habit, HabitStatus } from '../../types';

export interface UseHabitListOptions {
  status?: HabitStatus;
  enabled?: boolean;
}

export interface UseHabitListReturn {
  habits: Habit[];
  isLoading: boolean;
  isFetching: boolean;
  error: any;
  refetch: () => void;
  deleteHabit: (id: string) => Promise<void>;
  isDeleting: boolean;
}
