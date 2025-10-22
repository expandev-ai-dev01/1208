/**
 * @component Card
 * @summary Reusable card container component
 * @domain core
 * @type ui-component
 * @category display
 */

import type { CardProps } from './types';

export const Card = ({ children, className = '', padding = 'medium' }: CardProps) => {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  }[padding];

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${paddingClasses} ${className}`}
    >
      {children}
    </div>
  );
};
