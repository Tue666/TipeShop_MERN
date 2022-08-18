import { cloneElement } from 'react';
import { Navigate, Outlet, useOutletContext, useParams } from 'react-router-dom';

// hooks
import useAuth from '../hooks/useAuth';
// models
import type { Resource, Permission, Operation } from '../models';
// routes
import { PATH_EXTERNAL } from '../routes/path';

export interface ActionsPassedGuardProps {
  currentActions: Permission['operations'];
  actions: Operation[];
  actionsAllowed: Permission['operations'];
}

interface AccessGuardProps {
  accessConditions: Resource | ((params?: any) => Resource | undefined) | undefined;
  actionsRequired?: Permission['operations'];
  children?: JSX.Element;
}

const AccessGuard = ({ accessConditions, actionsRequired, children }: AccessGuardProps) => {
  const params = useParams();
  const { permissions } = useAuth();

  // Must provide the correct access conditions if there is guard layer
  if (typeof accessConditions === 'function') accessConditions = accessConditions(params);
  if (!accessConditions) return <Navigate to={PATH_EXTERNAL.denied} replace />;

  const { _id, locked, operations } = accessConditions;
  if (locked) return <Navigate to={PATH_EXTERNAL.denied} replace />;

  const currentAccess = permissions?.find((permission) => permission.resource.indexOf(_id) >= 0);
  if (!currentAccess) return <Navigate to={PATH_EXTERNAL.denied} replace />;
  if (
    actionsRequired &&
    actionsRequired.length > 0 &&
    !actionsRequired.every((action) => currentAccess.operations.indexOf(action) >= 0)
  )
    return <Navigate to={PATH_EXTERNAL.denied} replace />;

  const actionsAllowed: Permission['operations'] = currentAccess.operations.filter((action) => {
    const operation = operations.find((operation) => operation.name === action);
    return operation && !operation.locked;
  });
  const actionsPassed: ActionsPassedGuardProps = {
    currentActions: currentAccess.operations, // The actions that current account logged in can do
    actions: operations, // All original actions on resources
    actionsAllowed, // All possible actions on resource
  };
  if (children) return <>{cloneElement(children, actionsPassed)}</>;
  return <Outlet context={actionsPassed} />;
};

export default AccessGuard;

// Optional guard, used in case AccessGuard can not handle separate required actions
interface ActionGuardProps extends Required<Omit<AccessGuardProps, 'accessConditions'>> {}

export const ActionGuard = ({ actionsRequired, children }: ActionGuardProps) => {
  const actionsPassed = useOutletContext<ActionsPassedGuardProps>();
  const { currentActions } = actionsPassed;
  if (
    actionsRequired.length > 0 &&
    !actionsRequired.every((action) => currentActions.indexOf(action) >= 0)
  )
    return <Navigate to={PATH_EXTERNAL.denied} replace />;
  return <>{cloneElement(children, actionsPassed)}</>;
};
