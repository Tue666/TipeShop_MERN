import axiosInstance from './axiosInstance';

// contexts
import { ProfileProps } from '../contexts/AuthContext';

const accountApi = {
  // [GET] /accounts/profile
  getProfile: (): Promise<ProfileProps> => {
    const url = `/accounts/profile`;
    return axiosInstance.get(url);
  },
};

export default accountApi;
