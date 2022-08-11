import { cloneElement } from 'react';
import { Navigate } from 'react-router-dom';

// config
import { PermissionProps } from '../config';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_EXTERNAL } from '../routes/path';

interface AccessGuardProps {
  accessibleObject: PermissionProps;
  actionsRequired?: PermissionProps['actions'];
  children: JSX.Element;
}

const AccessGuard = ({ accessibleObject, actionsRequired, children }: AccessGuardProps) => {
  const { permissions } = useAuth();
  const { object, actions } = accessibleObject;
  const currentAccess = permissions?.find((permission) => permission.object === object);
  if (!currentAccess) return <Navigate to={PATH_EXTERNAL.denied} replace />;
  if (
    actionsRequired &&
    actionsRequired.length > 0 &&
    !actionsRequired.every((action) => currentAccess.actions.indexOf(action) >= 0)
  )
    return <Navigate to={PATH_EXTERNAL.denied} replace />;
  return <>{cloneElement(children, { currentActions: currentAccess.actions, actions })}</>;
};

export default AccessGuard;
