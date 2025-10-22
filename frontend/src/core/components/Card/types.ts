/**
 * @module core/components/Card/types
 * @summary Type definitions for Card component
 */

import { ReactNode } from 'react';

export type CardPadding = 'none' | 'small' | 'medium' | 'large';

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: CardPadding;
}
