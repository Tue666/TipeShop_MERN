// models
import { AccountType } from '../../models';

export const GET_ACCOUNTS = 'GET_ACCOUNTS';
export const CREATE_ACCOUNT = 'CREATE_ACCOUNT';

export interface GetAccountsPayload {
  type: AccountType;
}

export const getAccounts = (payload: GetAccountsPayload) => {
  return {
    type: GET_ACCOUNTS,
    payload,
  };
};

export const createAccount = (payload: FormData) => {
  return {
    type: CREATE_ACCOUNT,
    payload,
  };
};
