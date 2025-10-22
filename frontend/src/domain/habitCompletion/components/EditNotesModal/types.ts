/**
 * @module domain/habitCompletion/components/EditNotesModal/types
 * @summary Type definitions for EditNotesModal component
 */

import type { HabitCompletion } from '../../types';

export interface EditNotesModalProps {
  completion: HabitCompletion;
  onClose: () => void;
}

export interface NotesFormData {
  notes: string;
}
