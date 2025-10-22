/**
 * @component CompletionButton
 * @summary Button to mark a habit as completed with optional modal for details.
 * @domain habitCompletion
 * @type domain-component
 * @category action
 */

import { useState } from 'react';
import { Button } from '@/core/components/Button';
import { Check } from 'lucide-react';
import { CompletionModal } from '../CompletionModal';
import { useHabitCompletion } from '../../hooks';
import type { CompletionButtonProps } from './types';

export const CompletionButton = ({
  habitId,
  habitName,
  onSuccess,
  variant = 'default',
}: CompletionButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  const { markComplete, isMarking } = useHabitCompletion({
    habitId,
    onSuccess: () => {
      setShowModal(false);
      onSuccess?.();
    },
  });

  const handleQuickComplete = async () => {
    await markComplete();
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  if (variant === 'compact') {
    return (
      <>
        <Button
          variant="primary"
          size="small"
          onClick={handleQuickComplete}
          isLoading={isMarking}
          className="!p-2"
        >
          <Check className="h-4 w-4" />
        </Button>
        {showModal && (
          <CompletionModal
            habitId={habitId}
            habitName={habitName}
            onClose={() => setShowModal(false)}
            onSuccess={onSuccess}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex space-x-2">
        <Button
          variant="primary"
          size="medium"
          onClick={handleQuickComplete}
          isLoading={isMarking}
          fullWidth
        >
          <Check className="h-5 w-5 mr-2" />
          Marcar como Concluído
        </Button>
        <Button variant="outline" size="medium" onClick={handleOpenModal}>
          Detalhes
        </Button>
      </div>
      {showModal && (
        <CompletionModal
          habitId={habitId}
          habitName={habitName}
          onClose={() => setShowModal(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};
