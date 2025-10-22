/**
 * @module domain/habit/components/HabitForm/types
 * @summary Type definitions for HabitForm component
 */

import type { Habit, CreateHabitDto } from '../../types';

export interface HabitFormProps {
  habit?: Habit;
  onSubmit: (data: CreateHabitDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface HabitFormData {
  name: string;
  description: string;
  frequencyType: 'daily' | 'weekly' | 'monthly';
  frequencyValue: number;
  idealTime: string;
  categoryId: string;
}
