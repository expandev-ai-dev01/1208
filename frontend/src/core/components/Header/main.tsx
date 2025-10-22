/**
 * @component Header
 * @summary Application header with navigation and user menu
 * @domain core
 * @type ui-component
 * @category navigation
 */

import { Link } from 'react-router-dom';
import { useAuth } from '@/core/contexts/auth';
import { Button } from '../Button';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="h-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary-600">📊</span>
          <span className="text-xl font-bold text-gray-900">Gerenciador de Hábitos</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-700">Olá, {user?.name}</span>
              <Button variant="outline" size="small" onClick={logout}>
                Sair
              </Button>
            </>
          ) : (
            <Link to="/auth/login">
              <Button variant="primary" size="small">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
