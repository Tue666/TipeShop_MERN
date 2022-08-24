import { message } from 'antd';
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';

// apis
import type {
  InsertOperationResponse,
  InsertResourceResponse,
  InsertRoleResponse,
  UpdateOperationResponse,
  UpdateResourceResponse,
} from '../../apis/accessControlApi';
import accessControlApi from '../../apis/accessControlApi';
// models
import type { Resource, Operation, Role } from '../../models';
// redux
import { RootState } from '../store';
import {
  CreateOperationPayload,
  CreateResourcePayload,
  CreateRolePayload,
  CREATE_RESOURCE,
  CREATE_ROLE,
  UpdateOperationPayload,
  UpdateResourcePayload,
  UPDATE_RESOURCE,
} from '../actions/accessControl';
import { CREATE_OPERATION, UPDATE_OPERATION } from '../actions/accessControl';

export interface AccessControlState {
  isLoading: boolean;
  error: string | undefined;
  lastAction: 'create' | 'update' | undefined;
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

const newResources = (resources: Resource[], target: Resource): AccessControlState['resources'] => {
  const isRootTarget = target.parent_id === null;
  const rs = resourcesChanged(resources, target);
  return isRootTarget ? [...rs, target] : rs;
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
    createResourceSuccess: (state, action: PayloadAction<Resource>) => {
      state.resources = newResources(current(state.resources), action.payload);
    },
    updateResourceSuccess: (state, action: PayloadAction<Resource>) => {
      state.resources = newResources(current(state.resources), action.payload);
    },
    createOperationSuccess: (state, action: PayloadAction<Operation>) => {
      state.operations = [...state.operations, action.payload];
    },
    updateOperationSuccess: (state, action: PayloadAction<Operation>) => {
      const { _id, ...rest } = action.payload;
      state.operations = state.operations.map((operation) =>
        operation._id === _id ? { ...operation, ...rest } : operation
      );
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
    const response: InsertRoleResponse = yield call(accessControlApi.insertRole, action.payload);
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

function* createResource(action: PayloadAction<CreateResourcePayload>) {
  try {
    yield put(actions.startLoading());
    const response: InsertResourceResponse = yield call(
      accessControlApi.insertResource,
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
      accessControlApi.editResource,
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
    const response: InsertOperationResponse = yield call(
      accessControlApi.insertOperation,
      action.payload
    );
    const { operation, msg } = response;
    yield put(actions.createOperationSuccess(operation));
    yield put(actions.actionSuccess('create'));
    message.success({ content: msg, key: 'create' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'create' });
    }
  }
}

function* updateOperation(action: PayloadAction<UpdateOperationPayload>) {
  try {
    yield put(actions.startLoading());
    const { _id, ...values } = action.payload;
    const response: UpdateOperationResponse = yield call(
      accessControlApi.editOperation,
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

export function* accessControlSaga() {
  yield takeLatest(CREATE_ROLE, createRole);

  yield takeLatest(CREATE_RESOURCE, createResource);
  yield takeLatest(UPDATE_RESOURCE, updateResource);

  yield takeLatest(CREATE_OPERATION, createOperation);
  yield takeLatest(UPDATE_OPERATION, updateOperation);
}
