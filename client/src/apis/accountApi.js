import axiosInstance from './axiosInstance';

const accountApi = {
	// [GET] /accounts/profile
	getProfile: () => {
		const url = `/accounts/profile`;
		return axiosInstance.get(url);
	},
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
	// [POST] /accounts/addresses
	insertAddress: (body) => {
		const url = `/accounts/addresses`;
		return axiosInstance.post(url, {
			...body,
		});
	},
	// [PUT] /accounts/addresses
	editAddress: (body) => {
		const url = `/accounts/addresses`;
		return axiosInstance.put(url, {
			...body,
		});
	},
	// [DELETE] /accounts/addresses/:_id
	removeAddress: (_id) => {
		const url = `/accounts/addresses/${_id}`;
		return axiosInstance.delete(url);
	},
};

export default accountApi;
