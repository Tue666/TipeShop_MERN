// apis
import type {
  InsertRoleBody,
  InsertResourceBody,
  UpdateResourceParams,
  UpdateResourceBody,
  InsertOperationBody,
  UpdateOperationParams,
  UpdateOperationBody,
} from '../../apis/accessControlApi';

export const CREATE_ROLE = 'CREATE_ROLE';

export const CREATE_RESOURCE = 'CREATE_RESOURCE';
export const UPDATE_RESOURCE = 'UPDATE_RESOURCE';

export const CREATE_OPERATION = 'CREATE_OPERATION';
export const UPDATE_OPERATION = 'UPDATE_OPERATION';

export interface CreateRolePayload extends InsertRoleBody {}
export const createRoleAction = (payload: CreateRolePayload) => {
  return {
    type: CREATE_ROLE,
    payload,
  };
};

export interface CreateResourcePayload extends InsertResourceBody {}
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

export interface CreateOperationPayload extends InsertOperationBody {}
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
