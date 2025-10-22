/**
 * @module core/contexts/theme/types
 * @summary Type definitions for theme context
 */

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}
