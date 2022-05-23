import axiosInstance from './axiosInstance';

const accountApi = {
	// [POST] /accounts/exist
	checkExist: (phone_number) => {
		const url = `/accounts/exist`;
		return axiosInstance.post(url, {
			phone_number,
		});
	},
	// [POST] /accounts/login
	login: (body) => {
		const url = `/accounts/login`;
		return axiosInstance.post(url, {
			...body,
		});
	},
	// [POST] /accounts/register
	register: (body) => {
		const url = `/accounts/register`;
		return axiosInstance.post(url, {
			...body,
		});
	},
};

export default accountApi;
