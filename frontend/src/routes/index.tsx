/**
 * @module routes
 * @summary Application routing configuration
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { AuthGuard } from './guards';
import { WelcomePage } from '@/pages/welcome';
import { HabitManagementPage } from '@/pages/habitManagement';
import { HabitCompletionPage } from '@/pages/habitCompletion';
import { NotFoundPage } from '@/pages/notFound';

export const router = (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<WelcomePage />} />
      <Route
        path="habits"
        element={
          <AuthGuard>
            <HabitManagementPage />
          </AuthGuard>
        }
      />
      <Route
        path="habits/:id/completions"
        element={
          <AuthGuard>
            <HabitCompletionPage />
          </AuthGuard>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Route>

    <Route path="/auth" element={<AuthLayout />}>
      <Route index element={<Navigate to="/auth/login" replace />} />
    </Route>
  </Routes>
);
