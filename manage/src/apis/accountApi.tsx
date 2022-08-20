import axiosInstance from './axiosInstance';

// models
import type {
  ListResponse,
  Account,
  Administrator,
  Customer,
  StatusResponse,
  UploadFileType,
  Permission,
} from '../models';
// utils
import { TokenProps } from '../utils/jwt';

export interface FindAllAccountByTypeParams extends Pick<Account, 'type'> {}

export interface GetProfileResponse {
  profile: Account;
  permissions: Permission[];
}

export interface InsertAccountBody
  extends Omit<Account, '_id' | 'avatar_url' | 'type'>,
    Partial<Administrator>,
    Partial<Customer> {
  avatar_url: UploadFileType;
  password: string;
  passwordConfirm: string;
  account_type: Account['type'];
}
export interface InsertAccountResponse extends StatusResponse {
  account: Account;
}

export interface LoginParams {
  phone_number: string;
  password: string;
}
export interface LoginResponse {
  name: string;
  tokens: TokenProps;
}

const accountApi = {
  // [GET] /accounts/:type
  findAllByType: (params: FindAllAccountByTypeParams): Promise<ListResponse<Account>> => {
    const { type } = params;
    const url = `/accounts/${type}`;
    return axiosInstance.get(url);
  },

  // [GET] /accounts/profile
  getProfile: (): Promise<GetProfileResponse> => {
    const url = `/accounts/profile`;
    return axiosInstance.get(url);
  },

  // [POST] /accounts
  insert: (body: InsertAccountBody): Promise<InsertAccountResponse> => {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (key === 'avatar_url' && typeof value !== 'string')
        formData.append('avatar_url', value.file);
      else formData.append(key, value);
    });
    const url = `/accounts`;
    return axiosInstance.post(url, formData);
  },

  // [POST] /accounts/login
  login: (body: LoginParams): Promise<LoginResponse> => {
    const url = `/accounts/login`;
    return axiosInstance.post(url, {
      ...body,
    });
  },

  // [POST] /accounts/refreshToken
  refreshToken: (body: Record<'refreshToken', TokenProps['refreshToken']>): Promise<TokenProps> => {
    const url = `/accounts/refreshToken`;
    return axiosInstance.post(url, {
      ...body,
    });
  },

  // [GET] /accounts/verify
  verifyToken: (): Promise<boolean> => {
    const url = `/accounts/verify`;
    return axiosInstance.get(url);
  },
};

export default accountApi;
