import { message } from 'antd';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, takeEvery, takeLatest } from 'redux-saga/effects';

// apis
import accountApi from '../../apis/accountApi';
// models
import { ListResponse, Account } from '../../models';
// redux
import { RootState } from '../store';
import { GetAccountsPayload, GET_ACCOUNTS, CREATE_ACCOUNT } from '../actions/account';

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
        case 'administrator':
          state.administrators = data;
          break;
        case 'customer':
          state.customers = data;
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
    console.log(error);
  }
}

function* createAccount(action: PayloadAction<FormData>) {
  yield delay(3000);
  const { get } = action.payload;
  const phone = get('phone_number');
  console.log('success hehe test test', phone);
  message.success({ content: 'Loaded!', key: phone?.toString(), duration: 2 });
}

export function* accountSaga() {
  yield takeEvery(GET_ACCOUNTS, fetchAccounts);
  yield takeLatest(CREATE_ACCOUNT, createAccount);
}
