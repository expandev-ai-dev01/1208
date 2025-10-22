/**
 * @module domain/habitCompletion/components/CompletionModal/types
 * @summary Type definitions for CompletionModal component
 */

export interface CompletionModalProps {
  habitId: string;
  habitName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface CompletionFormData {
  completionDate: string;
  completionTime: string;
  notes: string;
}
