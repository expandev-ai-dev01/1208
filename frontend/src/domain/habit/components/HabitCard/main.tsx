/**
 * @component HabitCard
 * @summary Displays a single habit with actions.
 * @domain habit
 * @type domain-component
 * @category display
 */

import { useNavigate } from 'react-router-dom';
import { Card } from '@/core/components/Card';
import { Button } from '@/core/components/Button';
import { Edit2, Trash2, Clock, History } from 'lucide-react';
import { CompletionButton } from '@/domain/habitCompletion/components';
import type { HabitCardProps } from './types';

const frequencyLabels = {
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
};

export const HabitCard = ({ habit, onEdit, onDelete, onToggleStatus }: HabitCardProps) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (
      window.confirm('Tem certeza que deseja excluir este hábito? Esta ação não pode ser desfeita.')
    ) {
      onDelete(habit.id);
    }
  };

  const handleToggleStatus = () => {
    const newStatus = habit.status === 'active' ? 'inactive' : 'active';
    onToggleStatus(habit.id, newStatus);
  };

  const handleViewHistory = () => {
    navigate(`/habits/${habit.id}/completions`);
  };

  return (
    <Card padding="medium" className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                habit.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {habit.status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          {habit.description && <p className="text-sm text-gray-600 mb-3">{habit.description}</p>}

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="font-medium mr-1">Frequência:</span>
              {frequencyLabels[habit.frequencyType]}
              {habit.frequencyValue > 1 && ` (${habit.frequencyValue}x)`}
            </span>

            {habit.idealTime && (
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {habit.idealTime}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-2 ml-4">
          <Button variant="ghost" size="small" onClick={() => onEdit(habit)} className="!p-2">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={handleDelete}
            className="!p-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={handleViewHistory}
            className="!p-2 text-primary-600 hover:bg-primary-50"
          >
            <History className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {habit.status === 'active' && (
        <div className="mb-3">
          <CompletionButton habitId={habit.id} habitName={habit.name} variant="default" />
        </div>
      )}

      <div className="pt-3 border-t border-gray-200">
        <Button variant="outline" size="small" onClick={handleToggleStatus} fullWidth>
          {habit.status === 'active' ? 'Desativar' : 'Ativar'}
        </Button>
      </div>
    </Card>
  );
};
