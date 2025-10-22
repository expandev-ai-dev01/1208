/**
 * @module services/habit/habitTypes
 * @summary Type definitions for habit service
 */

export enum FrequencyType {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export enum HabitStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export interface HabitEntity {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  frequencyType: FrequencyType;
  frequencyValue: number;
  idealTime: string | null;
  creationDate: Date;
  lastUpdateDate: Date | null;
  status: HabitStatus;
  categoryId: string | null;
}

export interface HabitCreateRequest {
  userId: string;
  name: string;
  description?: string | null;
  frequencyType: FrequencyType;
  frequencyValue: number;
  idealTime?: string | null;
  categoryId?: string | null;
}

export interface HabitUpdateRequest {
  id: string;
  userId: string;
  name?: string;
  description?: string | null;
  frequencyType?: FrequencyType;
  frequencyValue?: number;
  idealTime?: string | null;
  status?: HabitStatus;
  categoryId?: string | null;
}

export interface HabitListResponse {
  id: string;
  name: string;
  description: string | null;
  frequencyType: FrequencyType;
  frequencyValue: number;
  idealTime: string | null;
  status: HabitStatus;
  categoryId: string | null;
  creationDate: Date;
}

export interface HabitTemplate {
  id: string;
  name: string;
  description: string | null;
  frequencyType: FrequencyType;
  frequencyValue: number;
  idealTime: string | null;
  category: string | null;
}
