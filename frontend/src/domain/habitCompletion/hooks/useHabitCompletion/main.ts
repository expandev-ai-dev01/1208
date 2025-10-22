/**
 * @hook useHabitCompletion
 * @summary Manages marking habits as completed with date/time and notes.
 * @domain habitCompletion
 * @type domain-hook
 * @category data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { habitCompletionService } from '../../services';
import type { UseHabitCompletionOptions, UseHabitCompletionReturn } from './types';
import type { CreateCompletionDto } from '../../types';
import toast from 'react-hot-toast';

export const useHabitCompletion = (
  options: UseHabitCompletionOptions
): UseHabitCompletionReturn => {
  const { habitId, onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const markCompleteMutation = useMutation({
    mutationFn: (data?: Partial<CreateCompletionDto>) =>
      habitCompletionService.create({
        habitId,
        completionDate: data?.completionDate,
        completionTime: data?.completionTime,
        notes: data?.notes,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['habit-completions', habitId] });
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast.success('Hábito marcado como concluído');
      onSuccess?.(data);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao marcar conclusão');
      onError?.(error);
    },
  });

  return {
    markComplete: markCompleteMutation.mutateAsync,
    isMarking: markCompleteMutation.isPending,
    error: markCompleteMutation.error,
  };
};
