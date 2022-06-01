import { shape, string, func, bool } from 'prop-types';
import { useEffect, useReducer } from 'react';
import { Stack, Typography, TextField, MenuItem } from '@mui/material';

// apis
import locationApi from '../../apis/locationApi';

const initialState = {
	regions: [],
	districts: [],
	wards: [],
};

const handlers = {
	FETCH_ALL_MATCHED: (state, action) => {
		const { regions, districts, wards } = action.payload;
		return {
			...state,
			regions,
			districts,
			wards,
		};
	},
	FETCH_REGIONS: (state, action) => {
		const regions = action.payload;
		return {
			...state,
			regions,
			districts: [],
			wards: [],
		};
	},
	FETCH_DISTRICTS: (state, action) => {
		const districts = action.payload;
		return {
			...state,
			districts,
			wards: [],
		};
	},
	FETCH_WARDS: (state, action) => {
		const wards = action.payload;
		return {
			...state,
			wards,
		};
	},
};

const reducer = (state, action) =>
	handlers[action.type] ? handlers[action.type](state, action) : state;

const propTypes = {
	isEdit: bool,
	location: shape({
		region: string,
		district: string,
		ward: string,
	}),
	errors: shape({
		region: string,
		district: string,
		ward: string,
	}),
	handleSelectedLocation: func,
};

const Location = ({ isEdit, location, errors, handleSelectedLocation }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const hasRegion = state.regions.find((region) => region._id === location.region);
	const hasDistrict = state.districts.find((district) => district._id === location.district);
	const hasWard = state.wards.find((ward) => ward._id === location.ward);
	useEffect(() => {
		if (!isEdit) {
			const getRegions = async () => {
				const regions = await locationApi.findRegionsByCountry('vn');
				dispatch({
					type: 'FETCH_REGIONS',
					payload: regions,
				});
			};
			getRegions();
		} else {
			const getAllMatched = async () => {
				const { region, district } = location;
				const regions = await locationApi.findRegionsByCountry('vn');
				const districts = await locationApi.findDistrictsByRegionId(region);
				const wards = await locationApi.findWardsByDistrictId(district);
				dispatch({
					type: 'FETCH_ALL_MATCHED',
					payload: {
						regions,
						districts,
						wards,
					},
				});
			};
			getAllMatched();
		}
		// eslint-disable-next-line
	}, [isEdit]);

	const handleChangeRegion = async (e) => {
		const region_id = e.target.value;
		handleSelectedLocation({
			...location,
			region: region_id,
			district: '',
			ward: '',
		});
		if (region_id === '') return;
		const districts = await locationApi.findDistrictsByRegionId(region_id);
		dispatch({
			type: 'FETCH_DISTRICTS',
			payload: districts,
		});
	};
	const handleChangeDistrict = async (e) => {
		const district_id = e.target.value;
		handleSelectedLocation({
			...location,
			district: district_id,
			ward: '',
		});
		if (district_id === '') return;
		const wards = await locationApi.findWardsByDistrictId(district_id);
		dispatch({
			type: 'FETCH_WARDS',
			payload: wards,
		});
	};
	const handleChangeWard = (e) => {
		const ward_id = e.target.value;
		handleSelectedLocation({
			...location,
			ward: ward_id,
		});
	};
	return (
		<>
			<Stack direction="row" alignItems="center" spacing={3}>
				<Typography variant="subtitle2" sx={{ width: '300px' }}>
					Province / City
				</Typography>
				<TextField
					value={hasRegion?._id || ''}
					fullWidth
					select
					label="Select Province / City"
					size="small"
					onChange={handleChangeRegion}
					error={Boolean(errors.region)}
					helperText={errors.region}
				>
					<MenuItem value="">Select Province / City</MenuItem>
					{state.regions.length > 0 &&
						state.regions.map((region) => {
							const { _id, name } = region;
							return (
								<MenuItem key={_id} value={_id}>
									{name}
								</MenuItem>
							);
						})}
				</TextField>
			</Stack>
			<Stack direction="row" alignItems="center" spacing={3}>
				<Typography variant="subtitle2" sx={{ width: '300px' }}>
					District
				</Typography>
				<TextField
					value={hasDistrict?._id || ''}
					fullWidth
					select
					label="Select District"
					size="small"
					onChange={handleChangeDistrict}
					error={Boolean(errors.district)}
					helperText={errors.district}
				>
					<MenuItem value="">Select District</MenuItem>
					{state.districts.length > 0 &&
						state.districts.map((district) => {
							const { _id, name } = district;
							return (
								<MenuItem key={_id} value={_id}>
									{name}
								</MenuItem>
							);
						})}
				</TextField>
			</Stack>
			<Stack direction="row" alignItems="center" spacing={3}>
				<Typography variant="subtitle2" sx={{ width: '300px' }}>
					Ward
				</Typography>
				<TextField
					value={hasWard?._id || ''}
					fullWidth
					select
					label="Select Ward"
					size="small"
					onChange={handleChangeWard}
					error={Boolean(errors.ward)}
					helperText={errors.ward}
				>
					<MenuItem value="">Select Ward</MenuItem>
					{state.wards.length > 0 &&
						state.wards.map((ward) => {
							const { _id, name } = ward;
							return (
								<MenuItem key={_id} value={_id}>
									{name}
								</MenuItem>
							);
						})}
				</TextField>
			</Stack>
		</>
	);
};

Location.propTypes = propTypes;

export default Location;
