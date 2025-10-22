/**
 * @module services/habitCompletion/completionTypes
 * @summary Type definitions for habit completion service
 */

export interface CompletionEntity {
  id: string;
  habitId: string;
  userId: string;
  completionDate: string;
  completionTime: string;
  registrationDateTime: Date;
  notes: string | null;
  deleted: boolean;
  deletionDateTime: Date | null;
  deletionReason: string | null;
}

export interface CompletionCreateRequest {
  userId: string;
  habitId: string;
  completionDate: string;
  completionTime: string;
  notes?: string | null;
}

export interface CompletionDeleteRequest {
  id: string;
  userId: string;
  reason?: string | null;
}

export interface CompletionHistoryRequest {
  userId: string;
  habitId: string;
  startDate?: string | null;
  endDate?: string | null;
}

export interface CompletionUpdateNotesRequest {
  id: string;
  userId: string;
  notes: string;
}
