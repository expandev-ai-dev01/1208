/**
 * @component MainLayout
 * @summary Main application layout with header, sidebar, and content area
 * @domain core
 * @type layout-component
 */

import { Outlet } from 'react-router-dom';
import { Header } from '@/core/components/Header';
import { Sidebar } from '@/core/components/Sidebar';
import { useAuth } from '@/core/contexts/auth';

export const MainLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {isAuthenticated && (
          <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white border-r border-gray-200">
            <Sidebar />
          </aside>
        )}

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
