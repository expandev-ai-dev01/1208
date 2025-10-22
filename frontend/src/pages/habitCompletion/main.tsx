/**
 * @page HabitCompletionPage
 * @summary Page for viewing habit completion history and managing completions.
 * @domain habitCompletion
 * @type detail-page
 * @category management
 *
 * @routing
 * - Path: /habits/:id/completions
 * - Params: { id: string }
 * - Guards: Authentication
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { habitService } from '@/domain/habit/services';
import { CompletionHistory } from '@/domain/habitCompletion/components';
import { Button } from '@/core/components/Button';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';

export const HabitCompletionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: habit, isLoading } = useQuery({
    queryKey: ['habit', id],
    queryFn: () => habitService.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Hábito não encontrado</h2>
        <Button variant="primary" onClick={() => navigate('/habits')}>
          Voltar para Hábitos
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="small" onClick={() => navigate('/habits')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Hábitos
        </Button>
      </div>

      <CompletionHistory habitId={habit.id} habitName={habit.name} />
    </div>
  );
};
