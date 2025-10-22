/**
 * @component Button
 * @summary Reusable button component with variants
 * @domain core
 * @type ui-component
 * @category form
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { buttonVariants } from './variants';
import type { ButtonProps } from './types';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      fullWidth = false,
      isLoading = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const variantClasses = buttonVariants[variant];
    const sizeClasses = {
      small: 'px-3 py-1.5 text-sm',
      medium: 'px-4 py-2 text-base',
      large: 'px-6 py-3 text-lg',
    }[size];

    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${variantClasses} ${sizeClasses} ${widthClass} ${disabledClass} ${className} font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Carregando...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
