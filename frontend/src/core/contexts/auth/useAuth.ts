/**
 * @hook useAuth
 * @summary Hook to access authentication context
 * @domain core
 * @type context-hook
 */

import { useContext } from 'react';
import { AuthContext } from './context';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
