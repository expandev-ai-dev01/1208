/**
 * @hook useHabitList
 * @summary Manages habit list with intelligent caching and deletion.
 * @domain habit
 * @type domain-hook
 * @category data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitService } from '../../services';
import type { UseHabitListOptions, UseHabitListReturn } from './types';
import toast from 'react-hot-toast';

export const useHabitList = (options: UseHabitListOptions = {}): UseHabitListReturn => {
  const { status, enabled = true } = options;
  const queryClient = useQueryClient();
  const queryKey = ['habits', status];

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: () => habitService.list(status),
    enabled,
    staleTime: 2 * 60 * 1000,
  });

  const { mutateAsync: deleteHabit, isPending: isDeleting } = useMutation({
    mutationFn: habitService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast.success('Hábito excluído com sucesso');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao excluir hábito');
    },
  });

  return {
    habits: data || [],
    isLoading,
    isFetching,
    error,
    refetch,
    deleteHabit,
    isDeleting,
  };
};
