const mongoose = require('mongoose');

// model
const { generateSeqById } = require('../models/Counter');
const Location = require('../models/Location');

class LocationsAPI {
	// [GET] /locations/regions/:country
	async findRegionsByCountry(req, res, next) {
		try {
			let { country } = req.params;
			country = country.toUpperCase();

			const regions = await Location.find({
				country,
			}).select('name');

			res.status(200).json(regions);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [GET] /locations/districts/:region_id
	async findDistrictsByRegionId(req, res, next) {
		try {
			let { region_id } = req.params;
			region_id = mongoose.Types.ObjectId(region_id);

			const districts = await Location.aggregate([
				{
					$match: { _id: region_id },
				},
				{
					$project: {
						_id: 0,
						'districts._id': 1,
						'districts.name': 1,
					},
				},
				{
					$unwind: '$districts',
				},
				{
					$replaceRoot: {
						newRoot: '$districts',
					},
				},
			]);

			res.status(200).json(districts);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [GET] /locations/wards/:district_id
	async findWardsByDistrictId(req, res, next) {
		try {
			let { district_id } = req.params;
			district_id = mongoose.Types.ObjectId(district_id);

			const wards = await Location.aggregate([
				{
					$match: {
						'districts._id': district_id,
					},
				},
				{
					$project: {
						district: {
							$filter: {
								input: '$districts',
								cond: {
									$eq: ['$$this._id', district_id],
								},
							},
						},
					},
				},
				{
					$project: {
						_id: 0,
						'district.wards._id': 1,
						'district.wards.name': 1,
					},
				},
				{
					$unwind: '$district',
				},
				{
					$replaceRoot: {
						newRoot: '$district',
					},
				},
				{
					$unwind: '$wards',
				},
				{
					$replaceRoot: {
						newRoot: '$wards',
					},
				},
			]);

			res.status(200).json(wards);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /locations/region
	/*
        name: String,
        country: String,
    */
	async insertRegion(req, res, next) {
		try {
			let { name, country } = req.body;
			country = country.toUpperCase();

			const uniqueValue = await generateSeqById('location');
			const location = new Location({
				name,
				country,
				code: `${country}${uniqueValue}`,
			});

			await location.save();

			res.status(201).json({
				msg: 'Insert region successfully!',
				region: location,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /locations/district/:region_id
	/*
        name: String,
    */
	async insertDistrict(req, res, next) {
		try {
			let { region_id } = req.params;
			region_id = mongoose.Types.ObjectId(region_id);
			const { name } = req.body;

			// check if region existed
			const region = await Location.findOne({ _id: region_id }).select('country');
			if (!region) {
				next({ status: 400, msg: 'Region not found!' });
				return;
			}

			const { _id, country } = region;
			const uniqueValue = await generateSeqById('location');
			const code = `${country}${uniqueValue}`;
			const location = await Location.findByIdAndUpdate(
				_id,
				{
					$addToSet: {
						districts: {
							name,
							code,
						},
					},
				},
				{
					new: true,
				}
			);

			// get the district has been inserted
			const { districts } = location;
			const district = districts.filter((district) => district.code === code);

			res.status(201).json({
				msg: 'Insert district successfully!',
				region_id,
				district,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /locations/ward/:district_id
	/*
        name: String,
    */
	async insertWard(req, res, next) {
		try {
			const { district_id } = req.params;
			const { name } = req.body;

			// check if region existed
			const region = await Location.findOne({ 'districts._id': district_id }).select('country');
			if (!region) {
				next({ status: 400, msg: 'Region not found!' });
				return;
			}

			const { _id, country } = region;
			const uniqueValue = await generateSeqById('location');
			const code = `${country}${uniqueValue}`;
			const location = await Location.findOneAndUpdate(
				{
					_id,
					'districts._id': district_id,
				},
				{
					$addToSet: {
						'districts.$.wards': {
							name,
							code,
						},
					},
				},
				{
					new: true,
				}
			);

			// get the ward has been inserted
			const { districts } = location;
			const district = districts.filter((district) => district._id.toString() === district_id);
			const { wards } = district[0];
			const ward = wards.filter((ward) => ward.code === code);

			res.status(201).json({
				msg: 'Insert ward successfully!',
				district_id,
				ward,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}
}

module.exports = new LocationsAPI();
