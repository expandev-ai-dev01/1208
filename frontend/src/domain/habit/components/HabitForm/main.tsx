/**
 * @component HabitForm
 * @summary Form for creating and editing habits with validation.
 * @domain habit
 * @type domain-component
 * @category form
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/core/components/Input';
import { Button } from '@/core/components/Button';
import type { HabitFormProps, HabitFormData } from './types';

const habitSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome do hábito deve ter pelo menos 3 caracteres')
    .max(50, 'O nome do hábito deve ter no máximo 50 caracteres')
    .refine(
      (val) => val.trim().length > 0,
      'O nome do hábito não pode conter apenas espaços em branco'
    ),
  description: z.string().max(200, 'A descrição deve ter no máximo 200 caracteres').optional(),
  frequencyType: z.enum(['daily', 'weekly', 'monthly'], {
    errorMap: () => ({ message: 'Selecione uma frequência válida' }),
  }),
  frequencyValue: z.coerce
    .number()
    .int()
    .min(1, 'O valor de frequência deve ser no mínimo 1')
    .superRefine((val, ctx) => {
      const frequencyType = (ctx as any).parent?.frequencyType;
      if (frequencyType === 'daily' && val !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Valor de frequência inválido para o tipo selecionado',
        });
      }
      if (frequencyType === 'weekly' && val > 7) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Valor de frequência inválido para o tipo selecionado',
        });
      }
      if (frequencyType === 'monthly' && val > 31) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Valor de frequência inválido para o tipo selecionado',
        });
      }
    }),
  idealTime: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'O horário deve estar no formato HH:MM')
    .optional()
    .or(z.literal('')),
  categoryId: z.string().uuid().optional().or(z.literal('')),
});

export const HabitForm = ({ habit, onSubmit, onCancel, isLoading = false }: HabitFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: habit?.name || '',
      description: habit?.description || '',
      frequencyType: habit?.frequencyType || 'daily',
      frequencyValue: habit?.frequencyValue || 1,
      idealTime: habit?.idealTime || '',
      categoryId: habit?.categoryId || '',
    },
  });

  const frequencyType = watch('frequencyType');

  const handleFormSubmit = async (data: HabitFormData) => {
    await onSubmit({
      name: data.name,
      description: data.description || null,
      frequencyType: data.frequencyType,
      frequencyValue: data.frequencyValue,
      idealTime: data.idealTime || null,
      categoryId: data.categoryId || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Nome do Hábito"
        {...register('name')}
        error={errors.name?.message}
        required
        fullWidth
        placeholder="Ex: Beber água"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          {...register('description')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
          placeholder="Descreva seu hábito (opcional)"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frequência <span className="text-red-500">*</span>
          </label>
          <select
            {...register('frequencyType')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="daily">Diária</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
          </select>
          {errors.frequencyType && (
            <p className="mt-1 text-sm text-red-600">{errors.frequencyType.message}</p>
          )}
        </div>

        <Input
          label="Vezes por período"
          type="number"
          {...register('frequencyValue')}
          error={errors.frequencyValue?.message}
          required
          fullWidth
          min={1}
          max={frequencyType === 'daily' ? 1 : frequencyType === 'weekly' ? 7 : 31}
          disabled={frequencyType === 'daily'}
        />
      </div>

      <Input
        label="Horário Ideal"
        type="time"
        {...register('idealTime')}
        error={errors.idealTime?.message}
        fullWidth
        helperText="Horário em que você pretende realizar o hábito"
      />

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {habit ? 'Atualizar Hábito' : 'Criar Hábito'}
        </Button>
      </div>
    </form>
  );
};
