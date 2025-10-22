/**
 * @module domain/habitCompletion/components/CompletionButton/types
 * @summary Type definitions for CompletionButton component
 */

export interface CompletionButtonProps {
  habitId: string;
  habitName: string;
  onSuccess?: () => void;
  variant?: 'default' | 'compact';
}
