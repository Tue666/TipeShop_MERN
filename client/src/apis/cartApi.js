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

	// [PATCH] /carts/quantity
	editQuantity: (body) => {
		const url = `/carts/quantity`;
		return axiosInstance.patch(url, {
			...body,
		});
	},

	// [PATCH] /carts/selected
	editSelected: (body) => {
		const url = `/carts/selected`;
		return axiosInstance.patch(url, {
			...body,
		});
	},

	// [PUT] /carts
	remove: (body) => {
		const url = `/carts`;
		return axiosInstance.put(url, {
			...body,
		});
	},
};

export default cartApi;
