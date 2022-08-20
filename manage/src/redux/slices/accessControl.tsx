import { message } from 'antd';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';

// apis
import type { InsertOperationResponse } from '../../apis/accessControlApi';
import accessControlApi from '../../apis/accessControlApi';
// models
import type { Resources, Operation } from '../../models';
// redux
import { RootState } from '../store';
import type { CreateOperationPayload, UpdateOperationPayload } from '../actions/accessControl';
import { CREATE_OPERATION, UPDATE_OPERATION } from '../actions/accessControl';

export interface AccessControlState {
  isLoading: boolean;
  error: string | undefined;
  lastAction: 'create' | 'update' | undefined;
  resources: Resources;
  operations: Operation[];
}

const initialState: AccessControlState = {
  isLoading: false,
  error: undefined,
  lastAction: undefined,
  resources: {},
  operations: [],
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
    },
    initializeAccessControl: (
      state,
      action: PayloadAction<Pick<AccessControlState, 'resources' | 'operations'>>
    ) => {
      const { resources, operations } = action.payload;
      state.resources = resources;
      state.operations = operations;
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

function* createOperation(action: PayloadAction<CreateOperationPayload>) {
  try {
    yield put(actions.startLoading());
    const response: InsertOperationResponse = yield call(
      accessControlApi.insertOperation,
      action.payload
    );
    const { operation, msg } = response;
    yield put(actions.createOperationSuccess(operation));
    yield put(actions.actionSuccess('update'));
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
    const response: InsertOperationResponse = yield call(
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
  yield takeLatest(CREATE_OPERATION, createOperation);
  yield takeLatest(UPDATE_OPERATION, updateOperation);
}
