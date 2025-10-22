/**
 * @hook useHabitForm
 * @summary Manages habit creation and editing with validation.
 * @domain habit
 * @type domain-hook
 * @category form
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitService } from '../../services';
import type { UseHabitFormOptions, UseHabitFormReturn } from './types';
import type { UpdateHabitDto } from '../../types';
import toast from 'react-hot-toast';

export const useHabitForm = (options: UseHabitFormOptions = {}): UseHabitFormReturn => {
  const { habitId, onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const {
    data: habit,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['habit', habitId],
    queryFn: () => habitService.getById(habitId!),
    enabled: !!habitId,
    staleTime: 2 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: habitService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast.success('Hábito criado com sucesso');
      onSuccess?.(data);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar hábito');
      onError?.(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateHabitDto) => habitService.update(habitId!, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit', habitId] });
      toast.success('Hábito atualizado com sucesso');
      onSuccess?.(data);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar hábito');
      onError?.(error);
    },
  });

  return {
    habit: habit || null,
    isLoading,
    isSaving: createMutation.isPending || updateMutation.isPending,
    error,
    createHabit: createMutation.mutateAsync,
    updateHabit: updateMutation.mutateAsync,
  };
};
