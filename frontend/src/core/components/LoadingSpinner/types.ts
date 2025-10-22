/**
 * @module core/components/LoadingSpinner/types
 * @summary Type definitions for LoadingSpinner component
 */

export type LoadingSpinnerSize = 'small' | 'medium' | 'large';

export interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  className?: string;
}
