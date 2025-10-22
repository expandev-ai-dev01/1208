/**
 * @module habit
 * @summary Module manifest for the habit domain.
 * @domain functional
 * @version 1.0.0
 */
export const moduleManifest = {
  name: 'habit',
  domain: 'functional',
  version: '1.0.0',
  publicComponents: ['HabitForm', 'HabitCard', 'TemplateSelector'],
  publicHooks: ['useHabitList', 'useHabitForm', 'useHabitTemplates'],
  publicServices: ['habitService', 'habitTemplateService'],
  publicStores: [],
  dependencies: {
    internal: ['@/core/components', '@/core/hooks', '@/core/lib'],
    external: ['react', 'react-hook-form', 'zod', '@tanstack/react-query', 'react-hot-toast'],
    domains: [],
  },
  exports: {
    components: ['HabitForm', 'HabitCard', 'TemplateSelector'],
    hooks: ['useHabitList', 'useHabitForm', 'useHabitTemplates'],
    services: ['habitService', 'habitTemplateService'],
    stores: [],
    types: [
      'Habit',
      'HabitTemplate',
      'CreateHabitDto',
      'UpdateHabitDto',
      'FrequencyType',
      'HabitStatus',
    ],
    utils: [],
  },
} as const;
