/**
 * @component EditNotesModal
 * @summary Modal for editing completion notes.
 * @domain habitCompletion
 * @type domain-component
 * @category form
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/core/components/Button';
import { useCompletionHistory } from '../../hooks';
import type { EditNotesModalProps, NotesFormData } from './types';

const notesSchema = z.object({
  notes: z
    .string()
    .min(1, 'A observação não pode estar vazia')
    .max(500, 'A observação não pode exceder 500 caracteres')
    .refine(
      (val) => val.trim().length > 0,
      'A observação não pode conter apenas espaços em branco'
    ),
});

export const EditNotesModal = ({ completion, onClose }: EditNotesModalProps) => {
  const { updateNotes, isUpdatingNotes } = useCompletionHistory({
    habitId: completion.habitId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NotesFormData>({
    resolver: zodResolver(notesSchema),
    defaultValues: {
      notes: completion.notes || '',
    },
  });

  const onSubmit = async (data: NotesFormData) => {
    await updateNotes(completion.id, { notes: data.notes });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Editar Observação</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observação <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('notes')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
              placeholder="Digite sua observação"
              maxLength={500}
            />
            {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isUpdatingNotes}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isUpdatingNotes}>
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
