// apis
import type {
  CreateRoleBody,
  UpdateRoleParams,
  UpdateRoleBody,
  CreateResourceBody,
  UpdateResourceParams,
  UpdateResourceBody,
  CreateOperationBody,
  UpdateOperationParams,
  UpdateOperationBody,
  DeleteOperationParams,
  RestoreOperationParams,
} from '../../apis/accessControlApi';

export const CREATE_ROLE = 'CREATE_ROLE';
export const UPDATE_ROLE = 'UPDATE_ROLE';

export const CREATE_RESOURCE = 'CREATE_RESOURCE';
export const UPDATE_RESOURCE = 'UPDATE_RESOURCE';

export const CREATE_OPERATION = 'CREATE_OPERATION';
export const UPDATE_OPERATION = 'UPDATE_OPERATION';
export const DELETE_OPERATION = 'DELETE_OPERATION';
export const RESTORE_OPERATION = 'RESTORE_OPERATION';

export interface CreateRolePayload extends CreateRoleBody {}
export const createRoleAction = (payload: CreateRolePayload) => {
  return {
    type: CREATE_ROLE,
    payload,
  };
};

export type UpdateRolePayload = UpdateRoleParams & UpdateRoleBody;
export const updateRoleAction = (payload: UpdateRolePayload) => {
  return {
    type: UPDATE_ROLE,
    payload,
  };
};

export interface CreateResourcePayload extends CreateResourceBody {}
export const createResourceAction = (payload: CreateResourcePayload) => {
  return {
    type: CREATE_RESOURCE,
    payload,
  };
};

export type UpdateResourcePayload = UpdateResourceParams & UpdateResourceBody;
export const updateResourceAction = (payload: UpdateResourcePayload) => {
  return {
    type: UPDATE_RESOURCE,
    payload,
  };
};

export interface CreateOperationPayload extends CreateOperationBody {}
export const createOperationAction = (payload: CreateOperationPayload) => {
  return {
    type: CREATE_OPERATION,
    payload,
  };
};

export type UpdateOperationPayload = UpdateOperationParams & UpdateOperationBody;
export const updateOperationAction = (payload: UpdateOperationPayload) => {
  return {
    type: UPDATE_OPERATION,
    payload,
  };
};

export type DeleteOperationPayload = DeleteOperationParams;
export const deleteOperationAction = (payload: DeleteOperationPayload) => {
  return {
    type: DELETE_OPERATION,
    payload,
  };
};

export type RestoreOperationPayload = RestoreOperationParams;
export const restoreOperationAction = (payload: RestoreOperationPayload) => {
  return {
    type: RESTORE_OPERATION,
    payload,
  };
};
