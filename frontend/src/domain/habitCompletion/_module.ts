/**
 * @module habitCompletion
 * @summary Module manifest for the habit completion domain.
 * @domain functional
 * @version 1.0.0
 */
export const moduleManifest = {
  name: 'habitCompletion',
  domain: 'functional',
  version: '1.0.0',
  publicComponents: ['CompletionButton', 'CompletionHistory', 'CompletionModal'],
  publicHooks: ['useHabitCompletion', 'useCompletionHistory'],
  publicServices: ['habitCompletionService'],
  publicStores: [],
  dependencies: {
    internal: ['@/core/components', '@/core/hooks', '@/core/lib'],
    external: [
      'react',
      'react-hook-form',
      'zod',
      '@tanstack/react-query',
      'react-hot-toast',
      'date-fns',
    ],
    domains: ['@/domain/habit'],
  },
  exports: {
    components: ['CompletionButton', 'CompletionHistory', 'CompletionModal'],
    hooks: ['useHabitCompletion', 'useCompletionHistory'],
    services: ['habitCompletionService'],
    stores: [],
    types: ['HabitCompletion', 'CreateCompletionDto', 'CompletionHistoryParams'],
    utils: [],
  },
} as const;
