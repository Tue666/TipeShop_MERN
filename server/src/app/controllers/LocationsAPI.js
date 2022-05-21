// model
const { generateSeqById } = require('../models/Counter');
const Location = require('../models/Location');

class LocationsAPI {
	// [POST] /locations/region
	/*
        name: String,
        country: String,
    */
	async insertRegion(req, res, next) {
		try {
			const { name, country } = req.body;

			const uniqueValue = await generateSeqById('location');
			const location = new Location({
				name,
				country,
				code: `${country.toUpperCase()}${uniqueValue}`,
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
			const { region_id } = req.params;
			const { name } = req.body;

			// check if region existed
			const region = await Location.findOne({ _id: region_id }).select('country');
			if (!region) {
				next({ status: 400, msg: 'Region not found!' });
				return;
			}

			const { _id, country } = region;
			const uniqueValue = await generateSeqById('location');
			const code = `${country.toUpperCase()}${uniqueValue}`;
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
			const code = `${country.toUpperCase()}${uniqueValue}`;
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
