// apis
import type {
  InsertOperationBody,
  UpdateOperationParams,
  UpdateOperationBody,
} from '../../apis/accessControlApi';

export const CREATE_OPERATION = 'CREATE_OPERATION';
export const UPDATE_OPERATION = 'UPDATE_OPERATION';

export interface CreateOperationPayload extends InsertOperationBody {}
export const createOperationAction = (payload: CreateOperationPayload) => {
  return {
    type: CREATE_OPERATION,
    payload,
  };
};

export type UpdateOperationPayload = UpdateOperationParams & UpdateOperationBody;
export const updateOperation = (payload: UpdateOperationPayload) => {
  return {
    type: UPDATE_OPERATION,
    payload,
  };
};
