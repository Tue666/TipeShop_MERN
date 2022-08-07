import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// apis
import accountApi from './accountApi';
// routes
import { PATH_AUTH } from '../routes/path';
// utils
import { getToken, setToken } from '../utils/jwt';
// config
import { apiConfig } from '../config';

interface AxiosConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: apiConfig.api_url,
});

axiosInstance.interceptors.request.use(
  (config: AxiosConfig): AxiosConfig => config,
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

const AxiosInterceptor = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response: AxiosResponse): any => response.data,
      async (error: AxiosError): Promise<any> => {
        const originalRequest: AxiosConfig = error.config;
        // access token was expired or unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // mark to try again only once
          const tokens = getToken();
          // unauthorized
          if (!tokens) navigate(PATH_AUTH.login, { replace: true });
          // generate new token if the authentication is successful
          try {
            const newTokens = await accountApi.refreshToken({ refreshToken: tokens?.refreshToken });
            setToken(newTokens);
            if (originalRequest.headers)
              originalRequest.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
            return axiosInstance(originalRequest);
          } catch (error) {
            setToken(null);
            navigate(PATH_AUTH.login, { replace: true });
          }
        }
        // Forbidden
        if (error.response?.status === 403) {
          alert('Forbidden...!');
        }
        return Promise.reject(error);
      }
    );
    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [navigate]);
  return children;
};

export { AxiosInterceptor };
export default axiosInstance;
