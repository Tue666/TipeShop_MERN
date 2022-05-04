import axiosInstance from './axiosInstance';

const categoryApi = {
	// [GET] /categories
	findAllRoot: () => {
		const url = `/categories`;
		return axiosInstance.get(url);
	},

	// [GET] /categories/:_id
	findById: (_id) => {
		const url = `/categories/${_id}`;
		return axiosInstance.get(url);
	},
};

export default categoryApi;
