/**
 * @module domain/habitCompletion/hooks/useCompletionHistory/types
 * @summary Type definitions for useCompletionHistory hook
 */

import type { HabitCompletion, UnmarkCompletionDto, UpdateCompletionNotesDto } from '../../types';

export interface UseCompletionHistoryOptions {
  habitId: string;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
}

export interface UseCompletionHistoryReturn {
  completions: HabitCompletion[];
  isLoading: boolean;
  isFetching: boolean;
  error: any;
  refetch: () => void;
  unmarkCompletion: (id: string, data?: UnmarkCompletionDto) => Promise<void>;
  updateNotes: (id: string, data: UpdateCompletionNotesDto) => Promise<HabitCompletion>;
  isUnmarking: boolean;
  isUpdatingNotes: boolean;
  canUnmark: (completion: HabitCompletion) => boolean;
  canEditNotes: (completion: HabitCompletion) => boolean;
}
