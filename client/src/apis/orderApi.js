import axiosInstance from './axiosInstance';

const orderApi = {
	// [GET] /orders?page&limit&[status]
	findByStatus: (page, limit, status) => {
		const url = `/orders?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`;
		return axiosInstance.get(url);
	},
	// [POST] /orders
	insert: (body) => {
		const url = `/orders`;
		return axiosInstance.post(url, {
			...body,
		});
	},
};

export default orderApi;
