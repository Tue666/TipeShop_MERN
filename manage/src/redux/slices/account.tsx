import { message } from 'antd';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// apis
import type {
  FindAllAccountByTypeResponse,
  CreateAccountResponse,
  UpdateAccountResponse,
} from '../../apis/accountApi';
import accountApi from '../../apis/accountApi';
// models
import type { GeneralAccount } from '../../models';
// redux
import { RootState } from '../store';
import type {
  GetAccountsPayload,
  CreateAccountPayload,
  UpdateAccountPayload,
} from '../actions/account';
import { GET_ACCOUNTS, CREATE_ACCOUNT, UPDATE_ACCOUNT } from '../actions/account';

export interface AccountState {
  isLoading: boolean;
  error: string | undefined;
  lastAction: 'create' | 'update' | undefined;
  administrators: GeneralAccount[];
  customers: GeneralAccount[];
}

const initialState: AccountState = {
  isLoading: false,
  error: undefined,
  lastAction: undefined,
  administrators: [],
  customers: [],
};

const slice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
      state.error = undefined;
      state.lastAction = undefined;
    },
    actionSuccess: (state, action: PayloadAction<AccountState['lastAction']>) => {
      state.isLoading = false;
      state.error = undefined;
      state.lastAction = action.payload;
    },
    hasError: (state, action: PayloadAction<AccountState['error']>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearAction: (state) => {
      state.lastAction = undefined;
      state.isLoading = false;
      state.error = undefined;
    },
    getAccountsSuccess: (
      state,
      action: PayloadAction<FindAllAccountByTypeResponse & GetAccountsPayload>
    ) => {
      const { data, type } = action.payload;
      switch (type) {
        case 'Administrator':
          state.administrators = data;
          break;
        case 'Customer':
          state.customers = data;
          break;
        default:
          break;
      }
    },
    createAccountSuccess: (state, action: PayloadAction<GeneralAccount>) => {
      const account = action.payload;
      const { type } = account;
      switch (type) {
        case 'Administrator':
          state.administrators = [...state.administrators, account];
          break;
        case 'Customer':
          state.customers = [...state.customers, account];
          break;
        default:
          break;
      }
    },
    updateAccountSuccess: (state, action: PayloadAction<GeneralAccount>) => {
      const account = action.payload;
      const { _id, type } = account;
      switch (type) {
        case 'Administrator':
          state.administrators = state.administrators.map((administrator) =>
            administrator._id === _id ? account : administrator
          );
          break;
        case 'Customer':
          state.customers = state.customers.map((customer) =>
            customer._id === _id ? account : customer
          );
          break;
        default:
          break;
      }
    },
  },
});

const { reducer, actions } = slice;
export const { clearAction } = actions;
export const selectAccount = (state: RootState) => state.account;
export const accountActions = actions;
export default reducer;

// ------------------------ saga ------------------------

function* getAccounts(action: PayloadAction<GetAccountsPayload>) {
  try {
    yield put(actions.startLoading());
    const { type } = action.payload;
    const response: FindAllAccountByTypeResponse = yield call(accountApi.findAllByType, { type });
    const { data } = response;
    yield put(actions.getAccountsSuccess({ data, type }));
    yield put(actions.actionSuccess());
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error(error.response?.statusText);
    }
  }
}

function* createAccount(action: PayloadAction<CreateAccountPayload>) {
  try {
    yield put(actions.startLoading());
    const response: CreateAccountResponse = yield call(accountApi.create, action.payload);
    const { account, msg } = response;
    yield put(actions.createAccountSuccess(account));
    yield put(actions.actionSuccess('create'));
    message.success({ content: msg, key: 'create' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'create' });
    }
  }
}

function* updateAccount(action: PayloadAction<UpdateAccountPayload>) {
  try {
    yield put(actions.startLoading());
    const { _id, ...values } = action.payload;
    const response: UpdateAccountResponse = yield call(accountApi.update, { _id }, values);
    const { account, msg } = response;
    yield put(actions.updateAccountSuccess(account));
    yield put(actions.actionSuccess('update'));
    message.success({ content: msg, key: 'update' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'update' });
    }
  }
}

export function* accountSaga() {
  yield takeEvery(GET_ACCOUNTS, getAccounts);

  yield takeLatest(CREATE_ACCOUNT, createAccount);
  yield takeLatest(UPDATE_ACCOUNT, updateAccount);
}
