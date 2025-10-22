/**
 * @module domain/habitCompletion/hooks/useHabitCompletion/types
 * @summary Type definitions for useHabitCompletion hook
 */

import type { CreateCompletionDto, HabitCompletion } from '../../types';

export interface UseHabitCompletionOptions {
  habitId: string;
  onSuccess?: (completion: HabitCompletion) => void;
  onError?: (error: any) => void;
}

export interface UseHabitCompletionReturn {
  markComplete: (data?: Partial<CreateCompletionDto>) => Promise<HabitCompletion>;
  isMarking: boolean;
  error: any;
}
