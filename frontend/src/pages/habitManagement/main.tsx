/**
 * @page HabitManagementPage
 * @summary Main page for managing habits (list, create, edit, delete).
 * @domain habit
 * @type management-page
 * @category management
 *
 * @routing
 * - Path: /habits
 * - Guards: Authentication
 */

import { useState } from 'react';
import { useHabitList, useHabitForm } from '@/domain/habit/hooks';
import { HabitForm, HabitCard, TemplateSelector } from '@/domain/habit/components';
import type { Habit, HabitTemplate, CreateHabitDto } from '@/domain/habit/types';
import { Button } from '@/core/components/Button';
import { Card } from '@/core/components/Card';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

type ViewMode = 'list' | 'create' | 'edit' | 'template';

export const HabitManagementPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [templateData, setTemplateData] = useState<HabitTemplate | null>(null);

  const { habits, isLoading, deleteHabit, isDeleting } = useHabitList();
  const { createHabit, updateHabit, isSaving } = useHabitForm({
    habitId: selectedHabit?.id,
    onSuccess: () => {
      setViewMode('list');
      setSelectedHabit(null);
      setTemplateData(null);
    },
  });

  const handleCreate = () => {
    setSelectedHabit(null);
    setTemplateData(null);
    setViewMode('create');
  };

  const handleEdit = (habit: Habit) => {
    setSelectedHabit(habit);
    setViewMode('edit');
  };

  const handleDelete = async (id: string) => {
    await deleteHabit(id);
  };

  const handleToggleStatus = async (id: string, status: 'active' | 'inactive') => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    if (status === 'active') {
      const activeCount = habits.filter((h) => h.status === 'active').length;
      if (activeCount >= 10) {
        toast.error(
          'Você atingiu o limite de 10 hábitos ativos. Desative ou exclua algum hábito para adicionar um novo.'
        );
        return;
      }
    }

    await updateHabit({ status });
  };

  const handleSubmit = async (data: CreateHabitDto) => {
    if (selectedHabit) {
      await updateHabit(data);
    } else {
      const activeCount = habits.filter((h) => h.status === 'active').length;
      if (activeCount >= 10) {
        toast.error(
          'Você atingiu o limite de 10 hábitos ativos. Desative ou exclua algum hábito para adicionar um novo.'
        );
        return;
      }
      await createHabit(data);
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedHabit(null);
    setTemplateData(null);
  };

  const handleTemplateSelect = (template: HabitTemplate) => {
    setTemplateData(template);
    setViewMode('create');
  };

  const handleShowTemplates = () => {
    setViewMode('template');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {viewMode === 'list' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meus Hábitos</h1>
              <p className="text-gray-600 mt-1">
                {habits.filter((h) => h.status === 'active').length} de 10 hábitos ativos
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleShowTemplates}>
                Usar Modelo
              </Button>
              <Button variant="primary" onClick={handleCreate}>
                <Plus className="h-5 w-5 mr-2" />
                Novo Hábito
              </Button>
            </div>
          </div>

          {habits.length === 0 ? (
            <Card padding="large" className="text-center">
              <div className="py-12">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum hábito cadastrado</h2>
                <p className="text-gray-600 mb-6">
                  Comece criando seu primeiro hábito ou escolha um modelo pré-definido.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button variant="outline" onClick={handleShowTemplates}>
                    Ver Modelos
                  </Button>
                  <Button variant="primary" onClick={handleCreate}>
                    Criar Hábito
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </>
      )}

      {viewMode === 'template' && (
        <TemplateSelector onSelect={handleTemplateSelect} onCancel={handleCancel} />
      )}

      {(viewMode === 'create' || viewMode === 'edit') && (
        <Card padding="large">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedHabit ? 'Editar Hábito' : 'Novo Hábito'}
          </h2>
          <HabitForm
            habit={
              selectedHabit ||
              (templateData
                ? {
                    id: '',
                    userId: '',
                    name: templateData.name,
                    description: templateData.description,
                    frequencyType: templateData.frequencyType,
                    frequencyValue: templateData.frequencyValue,
                    idealTime: templateData.idealTime,
                    creationDate: '',
                    status: 'active',
                    categoryId: null,
                  }
                : undefined)
            }
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSaving}
          />
        </Card>
      )}

      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-gray-700">Excluindo hábito...</p>
          </div>
        </div>
      )}
    </div>
  );
};
