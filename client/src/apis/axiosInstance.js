import axios from 'axios';
import { useEffect } from 'react';

// utils
import { getToken, setToken } from '../utils/jwt';
// config
import { apiConfig } from '../config';

const axiosInstance = axios.create({
	baseURL: apiConfig.environment === 'dev' ? apiConfig.api_url_dev : apiConfig.api_url_productiton,
});

axiosInstance.interceptors.request.use(
	(config) => config,
	(error) => Promise.reject(error)
);

const AxiosInterceptor = ({ children }) => {
	useEffect(() => {
		const interceptor = axiosInstance.interceptors.response.use(
			(response) => response && response.data,
			async (error) => {
				const originalRequest = error.config;
				console.log('start');
				// Access Token was expired or Unauthorized
				if (error.response.status === 401 && !originalRequest._retry) {
					originalRequest._retry = true; // mark to try again only once
					const tokens = getToken();
					// unauthorized
					if (!tokens) {
						//
						return Promise.reject(error);
					}
					// generate new token if the authentication is successful
					try {
						const newTokens = await axiosInstance.post('/accounts/refreshToken', {
							refreshToken: tokens.refreshToken,
						});
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
	}, []);
	return children;
};

export { AxiosInterceptor };
export default axiosInstance;
