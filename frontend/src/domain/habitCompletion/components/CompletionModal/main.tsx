/**
 * @component CompletionModal
 * @summary Modal for marking habit completion with date, time, and notes.
 * @domain habitCompletion
 * @type domain-component
 * @category form
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/core/components/Button';
import { Input } from '@/core/components/Input';
import { useHabitCompletion } from '../../hooks';
import type { CompletionModalProps, CompletionFormData } from './types';

const completionSchema = z
  .object({
    completionDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
      .refine((date) => {
        const completionDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return completionDate <= today;
      }, 'Não é possível registrar conclusões com data futura'),
    completionTime: z
      .string()
      .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Horário deve estar no formato HH:MM'),
    notes: z.string().max(500, 'As observações não podem exceder 500 caracteres').optional(),
  })
  .refine(
    (data) => {
      const completionDate = new Date(data.completionDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (completionDate.getTime() === today.getTime()) {
        const [hours, minutes] = data.completionTime.split(':').map(Number);
        const now = new Date();
        const completionDateTime = new Date();
        completionDateTime.setHours(hours, minutes, 0, 0);
        return completionDateTime <= now;
      }
      return true;
    },
    {
      message: 'Se a data for a atual, a hora não pode ser futura',
      path: ['completionTime'],
    }
  );

export const CompletionModal = ({
  habitId,
  habitName,
  onClose,
  onSuccess,
}: CompletionModalProps) => {
  const { markComplete, isMarking } = useHabitCompletion({
    habitId,
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
  });

  const now = new Date();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompletionFormData>({
    resolver: zodResolver(completionSchema),
    defaultValues: {
      completionDate: format(now, 'yyyy-MM-dd'),
      completionTime: format(now, 'HH:mm'),
      notes: '',
    },
  });

  const onSubmit = async (data: CompletionFormData) => {
    await markComplete({
      completionDate: data.completionDate,
      completionTime: data.completionTime,
      notes: data.notes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Marcar Conclusão</h2>
        <p className="text-gray-600 mb-6">{habitName}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Data de Conclusão"
            type="date"
            {...register('completionDate')}
            error={errors.completionDate?.message}
            required
            fullWidth
            max={format(new Date(), 'yyyy-MM-dd')}
          />

          <Input
            label="Horário de Conclusão"
            type="time"
            {...register('completionTime')}
            error={errors.completionTime?.message}
            required
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              {...register('notes')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Adicione observações sobre esta conclusão (opcional)"
              maxLength={500}
            />
            {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isMarking}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isMarking}>
              Confirmar Conclusão
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
