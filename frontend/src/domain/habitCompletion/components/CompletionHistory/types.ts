/**
 * @module domain/habitCompletion/components/CompletionHistory/types
 * @summary Type definitions for CompletionHistory component
 */

export interface CompletionHistoryProps {
  habitId: string;
  habitName: string;
}

export interface HistoryFilters {
  startDate: string;
  endDate: string;
}
