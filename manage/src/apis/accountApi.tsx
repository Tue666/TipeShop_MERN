import axiosInstance from './axiosInstance';

// models
import type {
  ListResponse,
  Account,
  GeneralAccount,
  StatusResponse,
  UploadFileType,
} from '../models';
// utils
import { TokenProps } from '../utils/jwt';

export interface FindAllAccountByTypeParams extends Pick<Account, 'type'> {}
export interface FindAllAccountByTypeResponse extends ListResponse<GeneralAccount> {}

export interface GetProfileResponse {
  profile: GeneralAccount;
}

export interface CreateAccountBody extends Omit<GeneralAccount, '_id' | 'avatar_url' | 'type'> {
  avatar_url: UploadFileType;
  password: string;
  passwordConfirm: string;
  account_type: Account['type'];
}
export interface CreateAccountResponse extends StatusResponse {
  account: GeneralAccount;
}

export interface UpdateAccountParams extends Pick<Account, '_id'> {}
export interface UpdateAccountBody extends Omit<GeneralAccount, '_id' | 'avatar_url' | 'type'> {
  avatar_url: UploadFileType;
  account_type: Account['type'];
}
export interface UpdateAccountResponse extends CreateAccountResponse {}

export interface LoginParams {
  phone_number: string;
  password: string;
}
export interface LoginResponse {
  name: string;
  tokens: TokenProps;
}

export interface RefreshTokenParams {
  refreshToken: TokenProps['refreshToken'];
}

const accountApi = {
  // [GET] /accounts/:type
  findAllByType: (params: FindAllAccountByTypeParams): Promise<FindAllAccountByTypeResponse> => {
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
  create: (body: CreateAccountBody): Promise<CreateAccountResponse> => {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (value) {
        if (key === 'avatar_url' && typeof value !== 'string')
          formData.append('avatar_url', value.file);
        else if (value instanceof Array) value.map((e) => formData.append(key, e));
        else formData.append(key, value);
      }
    });
    const url = `/accounts`;
    return axiosInstance.post(url, formData);
  },

  // [PUT] /accounts/:_id
  update: (
    params: UpdateAccountParams,
    body: UpdateAccountBody
  ): Promise<UpdateAccountResponse> => {
    const { _id } = params;
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (value) {
        if (key === 'avatar_url' && typeof value !== 'string')
          formData.append('avatar_url', value.file);
        else if (value instanceof Array) value.map((e) => formData.append(key, e));
        else formData.append(key, value);
      }
    });
    const url = `/accounts/${_id}`;
    return axiosInstance.put(url, formData);
  },

  // [POST] /accounts/login
  login: (body: LoginParams): Promise<LoginResponse> => {
    const url = `/accounts/login`;
    return axiosInstance.post(url, {
      ...body,
    });
  },

  // [POST] /accounts/refreshToken
  refreshToken: (body: RefreshTokenParams): Promise<TokenProps> => {
    const url = `/accounts/refreshToken`;
    return axiosInstance.post(url, {
      ...body,
    });
  },

  // [GET] /accounts/verify/:type
  verifyToken: (): Promise<boolean> => {
    const url = `/accounts/verify/administrator`;
    return axiosInstance.get(url);
  },
};

export default accountApi;
