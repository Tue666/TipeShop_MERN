import { Role } from './AccessControl';

export type AccountType = 'Administrator' | 'Customer';

export interface Account {
  _id: string;
  phone_number: string;
  avatar_url: string | null;
  name: string;
  email: string;
  roles: Role['name'][];
  type: AccountType;
}

export interface Administrator {}

export interface Customer {
  gender: string;
  social: {
    id: string | null;
    type: string;
  }[];
}

export interface GeneralAccount extends Account, Partial<Administrator>, Partial<Customer> {}
