/**
 * @component TemplateSelector
 * @summary Displays available habit templates for quick selection.
 * @domain habit
 * @type domain-component
 * @category display
 */

import { useHabitTemplates } from '../../hooks';
import { Card } from '@/core/components/Card';
import { Button } from '@/core/components/Button';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { Clock } from 'lucide-react';
import type { TemplateSelectorProps } from './types';

const frequencyLabels = {
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
};

export const TemplateSelector = ({ onSelect, onCancel }: TemplateSelectorProps) => {
  const { templates, isLoading } = useHabitTemplates();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Escolha um Modelo</h2>
        <Button variant="outline" onClick={onCancel}>
          Criar do Zero
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card padding="large" className="text-center">
          <p className="text-gray-600">Nenhum modelo disponível no momento.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="cursor-pointer" onClick={() => onSelect(template)}>
              <Card padding="medium" className="hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                {template.description && (
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>
                    <span className="font-medium">Frequência:</span>{' '}
                    {frequencyLabels[template.frequencyType]}
                    {template.frequencyValue > 1 && ` (${template.frequencyValue}x)`}
                  </span>
                  {template.idealTime && (
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {template.idealTime}
                    </span>
                  )}
                </div>
                {template.category && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded">
                      {template.category}
                    </span>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
