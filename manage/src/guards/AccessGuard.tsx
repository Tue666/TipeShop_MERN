import { cloneElement } from 'react';
import { Navigate, Outlet, useOutletContext, useParams } from 'react-router-dom';

// hooks
import useAuth from '../hooks/useAuth';
// models
import type { Resource, Permission, Operation, PartialBy } from '../models';
// routes
import { PATH_EXTERNAL } from '../routes/path';

/*
  Guard props
    - accessConditions  // define resource that permissions must match
    - [actionsRequired] // define operations must be in the resource being accessed
    - [exactActions]    // check if the whole operation is required
  Actions after passed include:
    - currentActions  // The actions that current account logged in can do
    - actions         // All original actions on resources
    - actionsAllowed  // All possible actions on resource
  How to get the actions after passed
    - Case AccessGuard has no children:
        useOutletContext<ActionsPassedGuardProps>() 
    - Case AccessGuard has no children & has ActionGuard:
        (props: ActionsPassedGuardProps)
    - Case AccessGuard has children:
        (props: ActionsPassedGuardProps)
*/

export interface ActionsPassedGuardProps {
  // currentActions: Permission['operations'];
  // actions: Operation[];
  actionsAllowed: Operation['name'][];
}

interface AccessGuardProps {
  accessConditions: Resource | ((params?: any) => Resource | undefined) | undefined;
  actionsRequired?: Permission['operations'];
  exactActions?: boolean; //
  children?: JSX.Element;
}

const AccessGuard = ({
  accessConditions,
  actionsRequired,
  exactActions = true,
  children,
}: AccessGuardProps) => {
  const params = useParams();
  const { permissions } = useAuth();

  // Must provide the correct access conditions if there is guard layer
  if (typeof accessConditions === 'function') accessConditions = accessConditions(params);
  if (!accessConditions) return <Navigate to={PATH_EXTERNAL.denied} replace />;

  const { _id, locked, operations } = accessConditions;
  if (locked) return <Navigate to={PATH_EXTERNAL.denied} replace />;

  const currentAccess = permissions?.find((permission) => permission.resource.indexOf(_id) >= 0);
  if (!currentAccess) return <Navigate to={PATH_EXTERNAL.denied} replace />;

  const actionsAllowed = currentAccess.operations.reduce((acc, id) => {
    const operation: Operation | undefined = operations.find((operation) => operation._id === id);
    if (!operation || operation.locked) return acc;
    return [...acc, operation.name];
  }, [] as Operation['name'][]);
  if (
    actionsRequired &&
    actionsRequired.length > 0 &&
    ((exactActions && !actionsRequired.every((action) => actionsAllowed.indexOf(action) >= 0)) ||
      (!exactActions && !actionsRequired.some((action) => actionsAllowed.indexOf(action) >= 0)))
  )
    return <Navigate to={PATH_EXTERNAL.denied} replace />;

  const actionsPassed: ActionsPassedGuardProps = {
    // currentActions: currentAccess.operations,
    // actions: operations,
    actionsAllowed,
  };
  if (children) return <>{cloneElement(children, actionsPassed)}</>;
  return <Outlet context={actionsPassed} />;
};

export default AccessGuard;

// Optional guard, used in case AccessGuard can not handle separate required actions
interface ActionGuardProps
  extends PartialBy<Required<Omit<AccessGuardProps, 'accessConditions'>>, 'exactActions'> {}

export const ActionGuard = ({
  actionsRequired,
  exactActions = true,
  children,
}: ActionGuardProps) => {
  const actionsPassed = useOutletContext<ActionsPassedGuardProps>();
  if (!actionsPassed) return <Navigate to={PATH_EXTERNAL.denied} replace />;

  const { actionsAllowed } = actionsPassed;
  if (
    actionsRequired.length > 0 &&
    !actionsRequired.every((action) => actionsAllowed.indexOf(action) >= 0) &&
    ((exactActions && !actionsRequired.every((action) => actionsAllowed.indexOf(action) >= 0)) ||
      (!exactActions && !actionsRequired.some((action) => actionsAllowed.indexOf(action) >= 0)))
  )
    return <Navigate to={PATH_EXTERNAL.denied} replace />;
  return <>{cloneElement(children, actionsPassed)}</>;
};
