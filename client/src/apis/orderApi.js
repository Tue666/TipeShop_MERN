import axiosInstance from './axiosInstance';

const orderApi = {
	// [GET] /orders?page&limit&[status][search]
	findByStatus: (page, limit, status, search) => {
		const queryStatus = status ? `&status=${status}` : '';
		const querySearch = search ? `&search=${search}` : '';
		const url = `/orders?page=${page}&limit=${limit}${queryStatus}${querySearch}`;
		return axiosInstance.get(url);
	},

	// [GET] /orders/:_id
	findById: (_id) => {
		const url = `/orders/${_id}`;
		return axiosInstance.get(url);
	},

	// [POST] /orders
	insert: (body) => {
		const url = `/orders`;
		return axiosInstance.post(url, {
			...body,
		});
	},

	// [PATCH] /orders/status
	editStatus: (body) => {
		const url = `/orders/status`;
		return axiosInstance.patch(url, {
			...body,
		});
	},
};

export default orderApi;
