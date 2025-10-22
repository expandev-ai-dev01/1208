/**
 * @component ErrorFallback
 * @summary Fallback UI displayed when an error is caught
 * @domain core
 * @type ui-component
 */

import { Button } from '../Button';

interface ErrorFallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
}

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Algo deu errado</h1>
        <p className="text-gray-600 mb-6">
          Desculpe, ocorreu um erro inesperado. Por favor, tente novamente.
        </p>
        {error && (
          <div className="bg-gray-100 rounded p-4 mb-6 text-left">
            <p className="text-sm text-gray-700 font-mono">{error.message}</p>
          </div>
        )}
        <Button onClick={resetErrorBoundary} variant="primary" fullWidth>
          Tentar Novamente
        </Button>
      </div>
    </div>
  );
};
