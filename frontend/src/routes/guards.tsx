/**
 * @module routes/guards
 * @summary Route protection guards for authentication and authorization
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/core/contexts/auth';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * @component AuthGuard
 * @summary Protects routes requiring authentication
 * @domain core
 * @type route-guard
 */
export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
