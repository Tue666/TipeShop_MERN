import axiosInstance from './axiosInstance';

const cartApi = {
	// [GET] /carts
	findByCustomerId: () => {
		const url = `/carts`;
		return axiosInstance.get(url);
	},
	// [POST] /carts
	insert: (body) => {
		const url = `/carts`;
		return axiosInstance.post(url, {
			...body,
		});
	},
};

export default cartApi;
