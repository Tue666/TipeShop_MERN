import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';

// apis
import accountApi from '../../apis/accountApi';
// models
import { ListResponse, Account, GetAccountsPayload } from '../../models';
// redux
import { RootState } from '../store';

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
    getAccounts: (state, action: PayloadAction<GetAccountsPayload>) => {
      state.isLoading = true;
    },
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

export function* accountSaga() {
  yield takeEvery(accountActions.getAccounts.type, fetchAccounts);
}
