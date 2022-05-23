import Cookies from 'js-cookie';

// apis
import axiosInstance from '../apis/axiosInstance';

const getToken = () => {
	const accessToken = Cookies.get('accessToken');
	return accessToken ? JSON.parse(accessToken) : null;
};

const setToken = (tokens) => {
	if (tokens) {
		Cookies.set('accessToken', JSON.stringify(tokens));
		axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
	} else {
		Cookies.remove('accessToken');
		delete axiosInstance.defaults.headers.common['Authorization'];
	}
};

const isValidToken = async (tokens) => {
	if (!tokens) return false;
	return await axiosInstance.get('/accounts/verify');
};

export { getToken, setToken, isValidToken };
