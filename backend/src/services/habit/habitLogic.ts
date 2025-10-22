/**
 * @module services/habit/habitLogic
 * @summary Business logic for habit management
 */

import { v4 as uuidv4 } from 'uuid';
import {
  HabitEntity,
  HabitCreateRequest,
  HabitUpdateRequest,
  HabitListResponse,
  HabitTemplate,
  FrequencyType,
  HabitStatus,
} from './habitTypes';

// In-memory storage
const habits: HabitEntity[] = [];

// Predefined templates
const templates: HabitTemplate[] = [
  {
    id: '1',
    name: 'Beber água',
    description: 'Beber 2 litros de água por dia',
    frequencyType: FrequencyType.Daily,
    frequencyValue: 1,
    idealTime: '08:00',
    category: 'Saúde',
  },
  {
    id: '2',
    name: 'Exercício físico',
    description: 'Praticar 30 minutos de exercício',
    frequencyType: FrequencyType.Weekly,
    frequencyValue: 3,
    idealTime: '07:00',
    category: 'Saúde',
  },
  {
    id: '3',
    name: 'Meditação',
    description: 'Meditar por 10 minutos',
    frequencyType: FrequencyType.Daily,
    frequencyValue: 1,
    idealTime: '06:00',
    category: 'Bem-estar',
  },
  {
    id: '4',
    name: 'Leitura',
    description: 'Ler por 30 minutos',
    frequencyType: FrequencyType.Daily,
    frequencyValue: 1,
    idealTime: '20:00',
    category: 'Produtividade',
  },
  {
    id: '5',
    name: 'Estudar',
    description: 'Dedicar tempo aos estudos',
    frequencyType: FrequencyType.Weekly,
    frequencyValue: 5,
    idealTime: '19:00',
    category: 'Produtividade',
  },
];

/**
 * @summary
 * Validates frequency value based on frequency type
 *
 * @function validateFrequencyValue
 * @module services/habit/habitLogic
 *
 * @param {FrequencyType} frequencyType - Type of frequency
 * @param {number} frequencyValue - Value to validate
 *
 * @throws {Error} When frequency value is invalid
 */
function validateFrequencyValue(frequencyType: FrequencyType, frequencyValue: number): void {
  if (frequencyType === FrequencyType.Daily && frequencyValue !== 1) {
    throw new Error('Para frequência diária, o valor deve ser sempre 1');
  }
  if (frequencyType === FrequencyType.Weekly && (frequencyValue < 1 || frequencyValue > 7)) {
    throw new Error('Para frequência semanal, o valor deve estar entre 1 e 7');
  }
  if (frequencyType === FrequencyType.Monthly && (frequencyValue < 1 || frequencyValue > 31)) {
    throw new Error('Para frequência mensal, o valor deve estar entre 1 e 31');
  }
}

/**
 * @summary
 * Counts active habits for a user
 *
 * @function countActiveHabits
 * @module services/habit/habitLogic
 *
 * @param {string} userId - User identifier
 *
 * @returns {number} Number of active habits
 */
export function countActiveHabits(userId: string): number {
  return habits.filter((h) => h.userId === userId && h.status === HabitStatus.Active).length;
}

/**
 * @summary
 * Creates a new habit
 *
 * @function habitCreate
 * @module services/habit/habitLogic
 *
 * @param {HabitCreateRequest} params - Habit creation parameters
 *
 * @returns {HabitEntity} Created habit entity
 *
 * @throws {Error} When validation fails or limit is reached
 */
export function habitCreate(params: HabitCreateRequest): HabitEntity {
  // Validate active habits limit
  const activeCount = countActiveHabits(params.userId);
  if (activeCount >= 10) {
    throw new Error(
      'Você atingiu o limite de 10 hábitos ativos. Desative ou exclua algum hábito para adicionar um novo'
    );
  }

  // Validate frequency
  validateFrequencyValue(params.frequencyType, params.frequencyValue);

  // Create habit
  const habit: HabitEntity = {
    id: uuidv4(),
    userId: params.userId,
    name: params.name,
    description: params.description || null,
    frequencyType: params.frequencyType,
    frequencyValue: params.frequencyValue,
    idealTime: params.idealTime || null,
    creationDate: new Date(),
    lastUpdateDate: null,
    status: HabitStatus.Active,
    categoryId: params.categoryId || null,
  };

  habits.push(habit);
  return habit;
}

/**
 * @summary
 * Lists all habits for a user
 *
 * @function habitList
 * @module services/habit/habitLogic
 *
 * @param {string} userId - User identifier
 * @param {HabitStatus} [status] - Optional status filter
 *
 * @returns {HabitListResponse[]} Array of habits
 */
export function habitList(userId: string, status?: HabitStatus): HabitListResponse[] {
  let userHabits = habits.filter((h) => h.userId === userId);

  if (status) {
    userHabits = userHabits.filter((h) => h.status === status);
  }

  return userHabits.map((h) => ({
    id: h.id,
    name: h.name,
    description: h.description,
    frequencyType: h.frequencyType,
    frequencyValue: h.frequencyValue,
    idealTime: h.idealTime,
    status: h.status,
    categoryId: h.categoryId,
    creationDate: h.creationDate,
  }));
}

/**
 * @summary
 * Gets a specific habit by ID
 *
 * @function habitGet
 * @module services/habit/habitLogic
 *
 * @param {string} id - Habit identifier
 * @param {string} userId - User identifier
 *
 * @returns {HabitEntity} Habit entity
 *
 * @throws {Error} When habit not found or user doesn't own it
 */
export function habitGet(id: string, userId: string): HabitEntity {
  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    throw new Error('O hábito que você está tentando acessar não existe');
  }

  if (habit.userId !== userId) {
    throw new Error('Você não tem permissão para acessar este hábito');
  }

  return habit;
}

/**
 * @summary
 * Updates an existing habit
 *
 * @function habitUpdate
 * @module services/habit/habitLogic
 *
 * @param {HabitUpdateRequest} params - Habit update parameters
 *
 * @returns {HabitEntity} Updated habit entity
 *
 * @throws {Error} When validation fails or habit not found
 */
export function habitUpdate(params: HabitUpdateRequest): HabitEntity {
  const habit = habitGet(params.id, params.userId);

  // If changing status to active, check limit
  if (params.status === HabitStatus.Active && habit.status === HabitStatus.Inactive) {
    const activeCount = countActiveHabits(params.userId);
    if (activeCount >= 10) {
      throw new Error(
        'Você não pode ativar este hábito pois já atingiu o limite de 10 hábitos ativos'
      );
    }
  }

  // Validate frequency if provided
  if (params.frequencyType && params.frequencyValue) {
    validateFrequencyValue(params.frequencyType, params.frequencyValue);
  }

  // Update fields
  if (params.name !== undefined) habit.name = params.name;
  if (params.description !== undefined) habit.description = params.description;
  if (params.frequencyType !== undefined) habit.frequencyType = params.frequencyType;
  if (params.frequencyValue !== undefined) habit.frequencyValue = params.frequencyValue;
  if (params.idealTime !== undefined) habit.idealTime = params.idealTime;
  if (params.status !== undefined) habit.status = params.status;
  if (params.categoryId !== undefined) habit.categoryId = params.categoryId;

  habit.lastUpdateDate = new Date();

  return habit;
}

/**
 * @summary
 * Deletes a habit
 *
 * @function habitDelete
 * @module services/habit/habitLogic
 *
 * @param {string} id - Habit identifier
 * @param {string} userId - User identifier
 *
 * @returns {void}
 *
 * @throws {Error} When habit not found or user doesn't own it
 */
export function habitDelete(id: string, userId: string): void {
  const habit = habitGet(id, userId);
  const index = habits.indexOf(habit);
  habits.splice(index, 1);
}

/**
 * @summary
 * Lists all available habit templates
 *
 * @function templateList
 * @module services/habit/habitLogic
 *
 * @returns {HabitTemplate[]} Array of templates
 */
export function templateList(): HabitTemplate[] {
  return templates;
}

/**
 * @summary
 * Gets a specific template by ID
 *
 * @function templateGet
 * @module services/habit/habitLogic
 *
 * @param {string} id - Template identifier
 *
 * @returns {HabitTemplate} Template entity
 *
 * @throws {Error} When template not found
 */
export function templateGet(id: string): HabitTemplate {
  const template = templates.find((t) => t.id === id);

  if (!template) {
    throw new Error('O modelo selecionado não está disponível');
  }

  return template;
}
