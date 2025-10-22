/**
 * @page NotFoundPage
 * @summary 404 error page
 * @domain core
 * @type error-page
 * @category public
 */

import { Link } from 'react-router-dom';
import { Button } from '@/core/components/Button';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Página não encontrada</h2>
        <p className="text-gray-600 mb-8">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/">
          <Button variant="primary" size="large">
            <Home className="h-5 w-5 mr-2" />
            Voltar para o Início
          </Button>
        </Link>
      </div>
    </div>
  );
};
