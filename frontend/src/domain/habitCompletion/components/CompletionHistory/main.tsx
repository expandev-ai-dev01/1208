/**
 * @component CompletionHistory
 * @summary Displays completion history with filtering and actions.
 * @domain habitCompletion
 * @type domain-component
 * @category display
 */

import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { Card } from '@/core/components/Card';
import { Button } from '@/core/components/Button';
import { Input } from '@/core/components/Input';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { Trash2, Edit2, Clock, Calendar } from 'lucide-react';
import { useCompletionHistory } from '../../hooks';
import { EditNotesModal } from '../EditNotesModal';
import type { CompletionHistoryProps, HistoryFilters } from './types';
import type { HabitCompletion } from '../../types';

export const CompletionHistory = ({ habitId, habitName }: CompletionHistoryProps) => {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);

  const [filters, setFilters] = useState<HistoryFilters>({
    startDate: format(thirtyDaysAgo, 'yyyy-MM-dd'),
    endDate: format(now, 'yyyy-MM-dd'),
  });

  const [editingCompletion, setEditingCompletion] = useState<HabitCompletion | null>(null);

  const { completions, isLoading, unmarkCompletion, isUnmarking, canUnmark, canEditNotes } =
    useCompletionHistory({
      habitId,
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

  const handleUnmark = async (id: string) => {
    if (window.confirm('Tem certeza que deseja desmarcar esta conclusão?')) {
      await unmarkCompletion(id);
    }
  };

  const handleEditNotes = (completion: HabitCompletion) => {
    setEditingCompletion(completion);
  };

  const handleFilterChange = (field: keyof HistoryFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Histórico de Conclusões</h2>
        <p className="text-gray-600">{habitName}</p>
      </div>

      <Card padding="medium">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Data Inicial"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            fullWidth
          />
          <Input
            label="Data Final"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            max={format(new Date(), 'yyyy-MM-dd')}
            fullWidth
          />
        </div>
      </Card>

      {completions.length === 0 ? (
        <Card padding="large" className="text-center">
          <p className="text-gray-600">Nenhuma conclusão encontrada para o período selecionado.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {completions.map((completion) => (
            <Card key={completion.id} padding="medium">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(completion.completionDate), 'dd/MM/yyyy')}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {completion.completionTime}
                    </span>
                  </div>

                  {completion.notes && (
                    <p className="text-gray-700 mt-2 p-3 bg-gray-50 rounded">{completion.notes}</p>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    Registrado em:{' '}
                    {format(new Date(completion.registrationDateTime), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>

                <div className="flex space-x-2 ml-4">
                  {canEditNotes(completion) && (
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleEditNotes(completion)}
                      className="!p-2"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                  {canUnmark(completion) && (
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleUnmark(completion.id)}
                      className="!p-2 text-red-600 hover:bg-red-50"
                      disabled={isUnmarking}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editingCompletion && (
        <EditNotesModal completion={editingCompletion} onClose={() => setEditingCompletion(null)} />
      )}
    </div>
  );
};
