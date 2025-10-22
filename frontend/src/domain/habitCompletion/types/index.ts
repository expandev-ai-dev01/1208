/**
 * @module domain/habitCompletion/types
 * @summary Type definitions for habit completion domain
 */

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  completionDate: string;
  completionTime: string;
  registrationDateTime: string;
  notes: string | null;
}

export interface CreateCompletionDto {
  habitId: string;
  completionDate?: string;
  completionTime?: string;
  notes?: string;
}

export interface UpdateCompletionNotesDto {
  notes: string;
}

export interface UnmarkCompletionDto {
  reason?: string;
}

export interface CompletionHistoryParams {
  habitId: string;
  startDate?: string;
  endDate?: string;
}
