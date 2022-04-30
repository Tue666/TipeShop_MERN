import axiosInstance from './axiosInstance';

const productApi = {
	// [GET] /products/ranking/:type/:number
	findRankingProducts: (type, number) => {
		const url = `/products/ranking/${type}/${number}`;
		return axiosInstance.get(url);
	},
};

export default productApi;
