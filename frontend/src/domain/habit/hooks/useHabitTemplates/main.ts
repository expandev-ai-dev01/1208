/**
 * @hook useHabitTemplates
 * @summary Manages habit templates for quick habit creation.
 * @domain habit
 * @type domain-hook
 * @category data
 */

import { useQuery } from '@tanstack/react-query';
import { habitTemplateService } from '../../services';
import type { UseHabitTemplatesReturn } from './types';

export const useHabitTemplates = (): UseHabitTemplatesReturn => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['habit-templates'],
    queryFn: habitTemplateService.list,
    staleTime: 10 * 60 * 1000,
  });

  const getTemplate = async (id: string) => {
    return habitTemplateService.getById(id);
  };

  return {
    templates: data || [],
    isLoading,
    error,
    getTemplate,
  };
};
