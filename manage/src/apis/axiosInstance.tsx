import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// config
import { apiConfig } from '../config';

const axiosInstance = axios.create({
  baseURL: apiConfig.api_url,
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => config,
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): any => response.data,
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

export default axiosInstance;
