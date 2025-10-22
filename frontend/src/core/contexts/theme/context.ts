/**
 * @context ThemeContext
 * @summary Theme context definition
 * @domain core
 * @type context
 */

import { createContext } from 'react';
import type { ThemeContextValue } from './types';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
