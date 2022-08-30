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

	// [POST] /accounts/social/login
	socialLogin: (body) => {
		const url = `/accounts/social/login`;
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

	// [PATCH] /accounts/addresses/default/:_id
	switchDefault: (_id) => {
		const url = `/accounts/addresses/default/${_id}`;
		return axiosInstance.patch(url);
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

	// [POST] /accounts/refreshToken
	refreshToken: (body) => {
		const url = `/accounts/refreshToken`;
		return axiosInstance.post(url, {
			...body,
		});
	},

	// [GET] /accounts/verify/:type
	verifyToken: () => {
		const url = `/accounts/verify/customer`;
		return axiosInstance.get(url);
	},

	// google apis
	getGoogleProfile: (tokenResponse) => {
		const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
		return axiosInstance.get(url, {
			headers: { Authorization: `${tokenResponse.token_type} ${tokenResponse.access_token}` },
		});
	},
};

export default accountApi;
