/**
 * @context AuthContext
 * @summary Authentication context definition
 * @domain core
 * @type context
 */

import { createContext } from 'react';
import type { AuthContextValue } from './types';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
