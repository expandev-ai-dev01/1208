/**
 * @component AuthLayout
 * @summary Layout for authentication pages (login, register)
 * @domain core
 * @type layout-component
 */

import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gerenciador de Hábitos</h1>
            <p className="text-gray-600 mt-2">Desenvolva hábitos saudáveis</p>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};
