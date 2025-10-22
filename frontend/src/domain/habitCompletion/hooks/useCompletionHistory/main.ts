/**
 * @hook useCompletionHistory
 * @summary Manages completion history with filtering and actions.
 * @domain habitCompletion
 * @type domain-hook
 * @category data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitCompletionService } from '../../services';
import type { UseCompletionHistoryOptions, UseCompletionHistoryReturn } from './types';
import type { HabitCompletion } from '../../types';
import toast from 'react-hot-toast';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export const useCompletionHistory = (
  options: UseCompletionHistoryOptions
): UseCompletionHistoryReturn => {
  const { habitId, startDate, endDate, enabled = true } = options;
  const queryClient = useQueryClient();
  const queryKey = ['habit-completions', habitId, startDate, endDate];

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: () => habitCompletionService.getHistory({ habitId, startDate, endDate }),
    enabled,
    staleTime: 2 * 60 * 1000,
  });

  const unmarkMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: any }) =>
      habitCompletionService.delete(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habit-completions', habitId] });
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast.success('Conclusão desmarcada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao desmarcar conclusão');
    },
  });

  const updateNotesMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      habitCompletionService.updateNotes(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habit-completions', habitId] });
      toast.success('Observação atualizada com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar observação');
    },
  });

  const canUnmark = (completion: HabitCompletion): boolean => {
    const registrationDate = new Date(completion.registrationDateTime);
    const now = new Date();
    const diffMs = now.getTime() - registrationDate.getTime();
    return diffMs <= SEVEN_DAYS_MS;
  };

  const canEditNotes = (completion: HabitCompletion): boolean => {
    const registrationDate = new Date(completion.registrationDateTime);
    const now = new Date();
    const diffMs = now.getTime() - registrationDate.getTime();
    return diffMs <= TWENTY_FOUR_HOURS_MS;
  };

  return {
    completions: data || [],
    isLoading,
    isFetching,
    error,
    refetch,
    unmarkCompletion: (id, data) => unmarkMutation.mutateAsync({ id, data }),
    updateNotes: (id, data) => updateNotesMutation.mutateAsync({ id, data }),
    isUnmarking: unmarkMutation.isPending,
    isUpdatingNotes: updateNotesMutation.isPending,
    canUnmark,
    canEditNotes,
  };
};
