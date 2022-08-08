import { ReactNode } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_AUTH } from '../routes/path';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  if (!isAuthenticated) return <Navigate to={PATH_AUTH.login} replace state={{ from: pathname }} />;
  return <>{children}</>;
};

export default AuthGuard;
