// apis
import type { FindAllAccountByTypeParams, InsertAccountBody } from '../../apis/accountApi';

export const FETCH_ACCOUNTS = 'FETCH_ACCOUNTS';
export const CREATE_ACCOUNT = 'CREATE_ACCOUNT';

export interface FetchAccountsPayload extends FindAllAccountByTypeParams {}
export const fetchAccounts = (payload: FetchAccountsPayload) => {
  return {
    type: FETCH_ACCOUNTS,
    payload,
  };
};

export interface CreateAccountPayload extends InsertAccountBody {}
export const createAccount = (payload: CreateAccountPayload) => {
  return {
    type: CREATE_ACCOUNT,
    payload,
  };
};
