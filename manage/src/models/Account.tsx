export type AccountType = 'administrator' | 'customer';

export interface Account {
  _id: string;
  phone_number: string;
  avatar_url: string;
  name: string;
  email: string;
  type: AccountType;
}

export interface Administrator {}
export interface Customer {
  gender: string;
}
