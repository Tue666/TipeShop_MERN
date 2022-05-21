import axiosInstance from './axiosInstance';

const accountApi = {
	// [POST] /accounts/exist
	checkExist: (phone_number) => {
		const url = `/accounts/exist`;
		return axiosInstance.post(url, {
			phone_number,
		});
	},
};

export default accountApi;
