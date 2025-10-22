/**
 * @module domain/habit/components/HabitCard/types
 * @summary Type definitions for HabitCard component
 */

import type { Habit } from '../../types';

export interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: 'active' | 'inactive') => void;
}
