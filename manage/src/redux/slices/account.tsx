import { message } from 'antd';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// apis
import accountApi from '../../apis/accountApi';
// models
import type { ListResponse, Account, StatusResponse } from '../../models';
// redux
import { RootState } from '../store';
import type { GetAccountsPayload, FormAccountPayload } from '../actions/account';
import { GET_ACCOUNTS, CREATE_ACCOUNT } from '../actions/account';

export interface AccountState {
  isLoading: boolean;
  administrators: Account[];
  customers: Account[];
}

const initialState: AccountState = {
  isLoading: false,
  administrators: [],
  customers: [],
};

const slice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    getAccountsSuccess: (
      state,
      action: PayloadAction<ListResponse<Account> & GetAccountsPayload>
    ) => {
      const { data, type } = action.payload;
      state.isLoading = false;
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
    createAccountSuccess: (state, action: PayloadAction<Account>) => {
      const account = action.payload;
      switch (account.type) {
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
  },
});

const { reducer, actions } = slice;
export const selectAccount = (state: RootState) => state.account;
export const accountActions = actions;
export default reducer;

// ------------------------ saga ------------------------

function* fetchAccounts(action: PayloadAction<GetAccountsPayload>) {
  try {
    const { type } = action.payload;
    const response: ListResponse<Account> = yield call(accountApi.findAllByType, { type });
    const { data } = response;
    yield put(actions.getAccountsSuccess({ data, type }));
  } catch (error) {
    if (axios.isAxiosError(error)) message.error(error.response?.statusText);
  }
}

function* createAccount(action: PayloadAction<FormAccountPayload>) {
  try {
    const { resetForm, ...formValues } = action.payload;
    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      if (key === 'avatar_url' && typeof value !== 'string')
        formData.append('avatar_url', value.file);
      else formData.append(key, value);
    });
    const response: { account: Account } & StatusResponse = yield call(accountApi.insert, formData);
    const { account, msg } = response;
    yield put(actions.createAccountSuccess(account));
    resetForm && resetForm();
    message.success({ content: msg, key: 'create' });
  } catch (error) {
    if (axios.isAxiosError(error))
      message.error({ content: error.response?.statusText, key: 'create' });
  }
}

export function* accountSaga() {
  yield takeEvery(GET_ACCOUNTS, fetchAccounts);
  yield takeLatest(CREATE_ACCOUNT, createAccount);
}
