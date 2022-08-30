import { message, Modal } from 'antd';
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';

// apis
import type {
  CreateRoleResponse,
  UpdateRoleResponse,
  CreateResourceResponse,
  UpdateResourceResponse,
  CreateOperationResponse,
  UpdateOperationResponse,
  DeleteOperationResponse,
  RestoreOperationResponse,
} from '../../apis/accessControlApi';
import accessControlApi from '../../apis/accessControlApi';
// models
import type { Resource, Operation, Role } from '../../models';
// redux
import { RootState } from '../store';
import type {
  CreateRolePayload,
  UpdateRolePayload,
  CreateResourcePayload,
  UpdateResourcePayload,
  CreateOperationPayload,
  UpdateOperationPayload,
  DeleteOperationPayload,
  RestoreOperationPayload,
} from '../actions/accessControl';
import {
  CREATE_ROLE,
  UPDATE_ROLE,
  CREATE_RESOURCE,
  UPDATE_RESOURCE,
  CREATE_OPERATION,
  UPDATE_OPERATION,
  DELETE_OPERATION,
  RESTORE_OPERATION,
} from '../actions/accessControl';

export interface AccessControlState {
  isLoading: boolean;
  error: string | undefined;
  lastAction: 'create' | 'update' | 'delete' | 'restore' | undefined;
  resources: Resource[];
  operations: Operation[];
  roles: Role[];
}

const initialState: AccessControlState = {
  isLoading: false,
  error: undefined,
  lastAction: undefined,
  resources: [],
  operations: [],
  roles: [],
};

const resourcesChanged = (
  resources: Resource[],
  target: Resource
): AccessControlState['resources'] => {
  // prevent target duplicate if the target becomes a child
  const resourcesFormated = resources.filter(
    (resource) => !(resource._id === target._id && !resource.parent_id)
  );
  return resourcesFormated.map((resource) => {
    const { _id, children } = resource;
    const isResourceHasTarget = children && children.find((e) => e._id === target._id);
    if (isResourceHasTarget) {
      // update resource if target is one of children
      const isResourceOwnsTarget = target.parent_id === _id;
      if (isResourceOwnsTarget)
        // update matched target
        return { ...resource, children: children.map((e) => (e._id === target._id ? target : e)) };
      // remove target if resource not owns target anymore (case of update target's parent)
      return { ...resource, children: children.filter((e) => e._id !== target._id) };
    } else if (target.parent_id === _id)
      // add target to matched resource
      return {
        ...resource,
        children: children ? [...resourcesChanged(children, target), target] : [target],
      };
    else if (children && children.length > 0)
      // recursive for children
      return { ...resource, children: resourcesChanged(children, target) };
    return resource;
  });
};

const newResourcesByResource = (
  resources: Resource[],
  target: Resource
): AccessControlState['resources'] => {
  const isRootTarget = target.parent_id === null;
  const rs = resourcesChanged(resources, target);
  return isRootTarget ? [...rs, target] : rs;
};

const newResourcesByOperation = (
  resources: Resource[],
  target: Operation | Operation['_id'] // will remove target in resources if input is Operation['_id']
): AccessControlState['resources'] => {
  const isObject = typeof target === 'object';
  return resources.map((resource) => {
    const { operations, children } = resource;
    if (operations && operations.length > 0) {
      const targetId = isObject ? target._id : target;
      const newOperations = isObject
        ? operations.map((operation) => (operation._id === targetId ? target : operation))
        : operations.filter((operation) => operation._id !== targetId);
      return {
        ...resource,
        operations: newOperations,
      };
    }
    if (children && children.length > 0)
      return { ...resource, children: newResourcesByOperation(children, target) };
    return resource;
  });
};

const slice = createSlice({
  name: 'accessControl',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
      state.error = undefined;
      state.lastAction = undefined;
    },
    actionSuccess: (state, action: PayloadAction<AccessControlState['lastAction']>) => {
      state.isLoading = false;
      state.error = undefined;
      state.lastAction = action.payload;
    },
    hasError: (state, action: PayloadAction<AccessControlState['error']>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearAction: (state) => {
      state.lastAction = undefined;
      state.isLoading = false;
      state.error = undefined;
    },
    initializeAccessControl: (
      state,
      action: PayloadAction<Pick<AccessControlState, 'resources' | 'operations' | 'roles'>>
    ) => {
      const { resources, operations, roles } = action.payload;
      state.resources = resources;
      state.operations = operations;
      state.roles = roles;
    },
    createRoleSuccess: (state, action: PayloadAction<Role>) => {
      state.roles = [...state.roles, action.payload];
    },
    updateRoleSuccess: (state, action: PayloadAction<Role>) => {
      const { _id, ...rest } = action.payload;
      state.roles = state.roles.map((role) => (role._id === _id ? { ...role, ...rest } : role));
    },
    createResourceSuccess: (state, action: PayloadAction<Resource>) => {
      state.resources = newResourcesByResource(current(state.resources), action.payload);
    },
    updateResourceSuccess: (state, action: PayloadAction<Resource>) => {
      state.resources = newResourcesByResource(current(state.resources), action.payload);
    },
    createOperationSuccess: (state, action: PayloadAction<Operation>) => {
      state.operations = [...state.operations, action.payload];
    },
    updateOperationSuccess: (state, action: PayloadAction<Operation>) => {
      const { _id, ...rest } = action.payload;
      state.operations = state.operations.map((operation) =>
        operation._id === _id ? { ...operation, ...rest } : operation
      );
      state.resources = newResourcesByOperation(current(state.resources), action.payload);
    },
    deleteOperationSuccess: (state, action: PayloadAction<Operation['_id']>) => {
      state.operations = state.operations.filter((operation) => operation._id !== action.payload);
      state.resources = newResourcesByOperation(current(state.resources), action.payload);
    },
    restoreOperationSuccess: (state, action: PayloadAction<Operation>) => {
      state.operations = [...state.operations, action.payload];
    },
  },
});

const { reducer, actions } = slice;
export const { initializeAccessControl, clearAction } = actions;
export const selectAccessControl = (state: RootState) => state.accessControl;
export default reducer;

function* createRole(action: PayloadAction<CreateRolePayload>) {
  try {
    yield put(actions.startLoading());
    const response: CreateRoleResponse = yield call(accessControlApi.createRole, action.payload);
    const { role, msg } = response;
    yield put(actions.createRoleSuccess(role));
    yield put(actions.actionSuccess('create'));
    message.success({ content: msg, key: 'create' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'create' });
    }
  }
}

function* updateRole(action: PayloadAction<UpdateRolePayload>) {
  try {
    yield put(actions.startLoading());
    const { _id, ...values } = action.payload;
    const response: UpdateRoleResponse = yield call(accessControlApi.updateRole, { _id }, values);
    const { role, msg } = response;
    yield put(actions.updateRoleSuccess(role));
    yield put(actions.actionSuccess('update'));
    message.success({ content: msg, key: 'update' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'update' });
    }
  }
}

function* createResource(action: PayloadAction<CreateResourcePayload>) {
  try {
    yield put(actions.startLoading());
    const response: CreateResourceResponse = yield call(
      accessControlApi.createResource,
      action.payload
    );
    const { resource, msg } = response;
    yield put(actions.createResourceSuccess(resource));
    yield put(actions.actionSuccess('create'));
    message.success({ content: msg, key: 'create' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'create' });
    }
  }
}

function* updateResource(action: PayloadAction<UpdateResourcePayload>) {
  try {
    yield put(actions.startLoading());
    const { _id, ...values } = action.payload;
    const response: UpdateResourceResponse = yield call(
      accessControlApi.updateResource,
      { _id },
      values
    );
    const { resource, msg } = response;
    yield put(actions.updateResourceSuccess(resource));
    yield put(actions.actionSuccess('update'));
    message.success({ content: msg, key: 'update' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'update' });
    }
  }
}

function* createOperation(action: PayloadAction<CreateOperationPayload>) {
  try {
    yield put(actions.startLoading());
    const response: CreateOperationResponse = yield call(
      accessControlApi.createOperation,
      action.payload
    );
    const { operation, msg } = response;
    yield put(actions.createOperationSuccess(operation));
    yield put(actions.actionSuccess('create'));
    message.success({ content: msg, key: 'create' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      if (error.response?.status === 405) {
        Modal.error({
          centered: true,
          title: `Found the operation in the recycle bin, restore it`,
          content:
            'Operation name is unique, to continue creating please restore or delete permanently in recycle bin',
        });
      }
      message.error({ content: error.response?.statusText, key: 'create' });
    }
  }
}

function* updateOperation(action: PayloadAction<UpdateOperationPayload>) {
  try {
    yield put(actions.startLoading());
    const { _id, ...values } = action.payload;
    const response: UpdateOperationResponse = yield call(
      accessControlApi.updateOperation,
      { _id },
      values
    );
    const { operation, msg } = response;
    yield put(actions.updateOperationSuccess(operation));
    yield put(actions.actionSuccess('update'));
    message.success({ content: msg, key: 'update' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'update' });
    }
  }
}

function* deleteOperation(action: PayloadAction<DeleteOperationPayload>) {
  try {
    yield put(actions.startLoading());
    const response: DeleteOperationResponse = yield call(
      accessControlApi.deleteOperation,
      action.payload
    );
    const { deletedId, msg } = response;
    yield put(actions.deleteOperationSuccess(deletedId));
    yield put(actions.actionSuccess('delete'));
    message.success({ content: msg, key: 'delete' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'delete' });
    }
  }
}

function* restoreOperation(action: PayloadAction<RestoreOperationPayload>) {
  try {
    yield put(actions.startLoading());
    const response: RestoreOperationResponse = yield call(
      accessControlApi.restoreOperation,
      action.payload
    );
    const { operation, msg } = response;
    yield put(actions.restoreOperationSuccess(operation));
    yield put(actions.actionSuccess('restore'));
    message.success({ content: msg, key: 'restore' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'restore' });
    }
  }
}

export function* accessControlSaga() {
  yield takeLatest(CREATE_ROLE, createRole);
  yield takeLatest(UPDATE_ROLE, updateRole);

  yield takeLatest(CREATE_RESOURCE, createResource);
  yield takeLatest(UPDATE_RESOURCE, updateResource);

  yield takeLatest(CREATE_OPERATION, createOperation);
  yield takeLatest(UPDATE_OPERATION, updateOperation);
  yield takeLatest(DELETE_OPERATION, deleteOperation);
  yield takeLatest(RESTORE_OPERATION, restoreOperation);
}
