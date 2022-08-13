// models
import type { Account, AccountType, Administrator, Customer, UploadFileType } from '../../models';

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

export interface FormAccountPayload
  extends Omit<Account, '_id' | 'avatar_url' | 'type'>,
    Partial<Administrator>,
    Partial<Customer> {
  avatar_url: UploadFileType;
  password: string;
  passwordConfirm: string;
  account_type: AccountType;
  [key: string]: any;
}

export const createAccount = (payload: FormAccountPayload) => {
  return {
    type: CREATE_ACCOUNT,
    payload,
  };
};
