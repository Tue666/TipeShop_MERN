import axios from 'axios';

// config
import { apiConfig } from '../config';

const axiosInstance = axios.create({
	baseURL: apiConfig.environment === 'dev' ? apiConfig.api_url_dev : apiConfig.api_url_productiton,
});

axiosInstance.interceptors.request.use(
	(config) => config,
	(error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
	(response) => response && response.data,
	(error) => Promise.reject(error)
);

export default axiosInstance;
