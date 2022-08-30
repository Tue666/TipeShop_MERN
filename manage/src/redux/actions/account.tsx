// apis
import type {
  FindAllAccountByTypeParams,
  CreateAccountBody,
  UpdateAccountBody,
  UpdateAccountParams,
} from '../../apis/accountApi';

export const GET_ACCOUNTS = 'GET_ACCOUNTS';

export const CREATE_ACCOUNT = 'CREATE_ACCOUNT';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';

export interface GetAccountsPayload extends FindAllAccountByTypeParams {}
export const getAccountsAction = (payload: GetAccountsPayload) => {
  return {
    type: GET_ACCOUNTS,
    payload,
  };
};

export interface CreateAccountPayload extends CreateAccountBody {}
export const createAccountAction = (payload: CreateAccountPayload) => {
  return {
    type: CREATE_ACCOUNT,
    payload,
  };
};

export type UpdateAccountPayload = UpdateAccountParams & UpdateAccountBody;
export const updateAccountAction = (payload: UpdateAccountPayload) => {
  return {
    type: UPDATE_ACCOUNT,
    payload,
  };
};
