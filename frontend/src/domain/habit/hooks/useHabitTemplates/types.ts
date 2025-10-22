/**
 * @module domain/habit/hooks/useHabitTemplates/types
 * @summary Type definitions for useHabitTemplates hook
 */

import type { HabitTemplate } from '../../types';

export interface UseHabitTemplatesReturn {
  templates: HabitTemplate[];
  isLoading: boolean;
  error: any;
  getTemplate: (id: string) => Promise<HabitTemplate>;
}
