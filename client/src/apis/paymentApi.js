import axiosInstance from './axiosInstance';

const paymentApi = {
	// [POST] /payment/momo/create
	momoCreate: (body) => {
		const url = `/payment/momo/create`;
		return axiosInstance.post(url, {
			...body,
		});
	},

	// [POST] /payment/vnpay/create
	vnpayCreate: (body) => {
		const url = `/payment/vnpay/create`;
		return axiosInstance.post(url, {
			...body,
		});
	},
};

export default paymentApi;
