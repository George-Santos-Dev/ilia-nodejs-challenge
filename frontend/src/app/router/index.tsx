import { Navigate, createBrowserRouter } from 'react-router-dom';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { LoginPage } from '@/pages/login/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { ROUTES } from '@/shared/constants/routes';
import { hasAccessToken } from '@/shared/services/auth/token-storage';

export const appRouter = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
    ],
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={hasAccessToken() ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />,
  },
]);
