export type GetAccountsPayload = {
  type: 'administrator' | 'customer';
};

export interface Account {
  _id: string;
  phone_number: string;
  avatar_url: string;
  name: string;
  email: string;
  type: string;
}

export interface Administrator {}
export interface Customer {}
