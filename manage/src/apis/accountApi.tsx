import axiosInstance from './axiosInstance';

// contexts
import { ProfileProps, LoginParams, LoginResponse } from '../contexts/AuthContext';
// models
import type { ListResponse, Account, StatusResponse } from '../models';
// redux
import type { GetAccountsPayload } from '../redux/actions/account';
// utils
import { TokenProps } from '../utils/jwt';

const accountApi = {
  // [GET] /accounts/:type
  findAllByType: ({ type }: GetAccountsPayload): Promise<ListResponse<Account>> => {
    const url = `/accounts/${type}`;
    return axiosInstance.get(url);
  },

  // [GET] /accounts/profile
  getProfile: (): Promise<ProfileProps> => {
    const url = `/accounts/profile`;
    return axiosInstance.get(url);
  },

  // [POST] /accounts
  insert: (body: FormData): Promise<{ account: Account } & StatusResponse> => {
    const url = `/accounts`;
    return axiosInstance.post(url, body);
  },

  // [POST] /accounts/login
  login: (body: LoginParams): Promise<LoginResponse> => {
    const url = `/accounts/login`;
    return axiosInstance.post(url, {
      ...body,
    });
  },

  // [POST] /accounts/refreshToken
  refreshToken: (body: { refreshToken: TokenProps['refreshToken'] }): Promise<TokenProps> => {
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
