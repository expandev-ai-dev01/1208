/**
 * @module domain/habit/components/TemplateSelector/types
 * @summary Type definitions for TemplateSelector component
 */

import type { HabitTemplate } from '../../types';

export interface TemplateSelectorProps {
  onSelect: (template: HabitTemplate) => void;
  onCancel: () => void;
}
