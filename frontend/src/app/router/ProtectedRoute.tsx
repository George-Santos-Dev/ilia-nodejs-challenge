import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { hasAccessToken } from '@/shared/services/auth/token-storage';

export function ProtectedRoute() {
  if (!hasAccessToken()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
