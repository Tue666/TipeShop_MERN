import axiosInstance from './axiosInstance';

const productApi = {
	// [GET] /products/:_id
	findById: (_id) => {
		const url = `/products/${_id}`;
		return axiosInstance.get(url);
	},

	// [GET] /products/:page/:number
	findAllWithPagination: (page, number) => {
		const url = `/products/${page}/${number}`;
		return axiosInstance.get(url);
	},

	// [GET] /products/filtered
	findFilteredProducts: (queries) => {
		const url = `/products/filtered`;
		return axiosInstance.post(url, {
			...queries,
		});
	},

	// [GET] /products/ranking/:type/:number
	findRankingProducts: (type, number) => {
		const url = `/products/ranking/${type}/${number}`;
		return axiosInstance.get(url);
	},
};

export default productApi;
