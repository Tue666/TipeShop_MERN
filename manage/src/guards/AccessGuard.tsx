import { cloneElement } from 'react';
import { Navigate } from 'react-router-dom';

// config
import { PermissionProps } from '../config';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_EXTERNAL } from '../routes/path';

interface AccessGuardProps {
  objectAccessible: PermissionProps;
  children: JSX.Element;
}

const AccessGuard = ({ objectAccessible, children }: AccessGuardProps) => {
  const { permissions } = useAuth();
  const { object, actions } = objectAccessible;
  const currentAccess = permissions?.find((permission) => permission.object === object);
  if (!currentAccess) return <Navigate to={PATH_EXTERNAL.denied} replace />;
  return <>{cloneElement(children, { currentActions: currentAccess.actions, actions })}</>;
};

export default AccessGuard;
