import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { hasAccessToken } from '@/shared/services/auth/token-storage';

export function PublicOnlyRoute() {
  if (hasAccessToken()) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
