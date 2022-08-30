import axios from 'axios';
import { useEffect } from 'react';

// apis
import accountApi from './accountApi';
// hooks
import useModal from '../hooks/useModal';
// utils
import { getToken, setToken } from '../utils/jwt';
// config
import { apiConfig } from '../config';

const axiosInstance = axios.create({
	baseURL: apiConfig.api_url,
});

axiosInstance.interceptors.request.use(
	(config) => config,
	(error) => Promise.reject(error)
);

const AxiosInterceptor = ({ children }) => {
	const { openModal, keys } = useModal();
	useEffect(() => {
		const interceptor = axiosInstance.interceptors.response.use(
			(response) => response && response.data,
			async (error) => {
				const originalRequest = error.config;
				// Access Token was expired or Unauthorized
				if (error.response.status === 401 && !originalRequest._retry) {
					originalRequest._retry = true; // mark to try again only once
					const tokens = getToken();
					// unauthorized
					if (!tokens) {
						openModal(keys.authentication, null, false);
						return Promise.reject(error);
					}
					// generate new token if the authentication is successful
					try {
						const newTokens = await accountApi.refreshToken({ refreshToken: tokens.refreshToken });
						setToken(newTokens);
						originalRequest.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
						return axiosInstance(originalRequest);
					} catch (error) {
						setToken(null);
						window.location.reload();
					}
				}
				// Forbidden
				if (error.response.status === 403) {
					alert('Forbidden...!');
				}
				return Promise.reject(error);
			}
		);
		return () => axiosInstance.interceptors.response.eject(interceptor);
	}, [openModal, keys]);
	return children;
};

export { AxiosInterceptor };
export default axiosInstance;
