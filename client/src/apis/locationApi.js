import axiosInstance from './axiosInstance';

const locationApi = {
	// [GET] /locations/regions/:country
	findRegionsByCountry: (country) => {
		const url = `/locations/regions/${country}`;
		return axiosInstance.get(url);
	},

	// [GET] /locations/districts/:region_id
	findDistrictsByRegionId: (region_id) => {
		const url = `/locations/districts/${region_id}`;
		return axiosInstance.get(url);
	},

	// [GET] /locations/wards/:district_id
	findWardsByDistrictId: (district_id) => {
		const url = `/locations/wards/${district_id}`;
		return axiosInstance.get(url);
	},
};

export default locationApi;
