import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_AUTH } from '../routes/path';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to={PATH_AUTH.login} />;
  return <>{children}</>;
};

export default AuthGuard;
