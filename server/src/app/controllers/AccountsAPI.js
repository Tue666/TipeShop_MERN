const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// models
const { Types, Account, Customer, Administrator } = require('../models/Account');
const Address = require('../models/Address');
const Location = require('../models/Location');
// utils
const cloudinaryUpload = require('../../utils/cloudinaryUpload');
const { generateToken, verify } = require('../../utils/jwt');
const { capitalize } = require('../../utils/formatString');

class AccountsAPI {
	// [GET] /accounts/:type
	async findAllByType(req, res, next) {
		try {
			let _id = req.account._id;
			_id = mongoose.Types.ObjectId(_id);
			const { type } = req.params;
			const capitalizedType = capitalize(type);

			const accounts = await Account.find({
				_id: { $ne: _id },
				type: capitalizedType,
			}).select('-password -refreshToken');

			res.status(200).json({
				data: accounts,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [GET] /accounts/verify/:type
	async verify(req, res, next) {
		try {
			const { type } = req.params;
			const capitalizedType = capitalize(type);

			const isPassed = req.account._id && req.account.type === capitalizedType;

			res.status(200).json(isPassed);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [GET] /accounts/profile
	async getProfile(req, res, next) {
		try {
			let { _id } = req.account;
			_id = mongoose.Types.ObjectId(_id);

			// const result = await Account.aggregate([
			// 	{
			// 		$match: { _id },
			// 	},
			// 	{
			// 		$lookup: {
			// 			from: 'roles',
			// 			let: {
			// 				roles: '$roles',
			// 			},
			// 			pipeline: [
			// 				{
			// 					$match: { $expr: { $in: ['$name', '$$roles'] } },
			// 				},
			// 			],
			// 			as: 'roles',
			// 		},
			// 	},
			// 	{
			// 		$addFields: {
			// 			permissions: {
			// 				$reduce: {
			// 					input: '$roles',
			// 					initialValue: [],
			// 					in: { $concatArrays: ['$$value', '$$this.permissions'] },
			// 				},
			// 			},
			// 		},
			// 	},
			// 	{
			// 		$project: {
			// 			password: 0,
			// 			refreshToken: 0,
			// 			__v: 0,
			// 		},
			// 	},
			// ]);

			// const { permissions, ...profile } = result[0];

			const profile = await Account.findOne({ _id }).select('-password -refreshToken');

			let dependentDetails = {};
			const type = profile.type;
			switch (type) {
				case Types.customer:
					const addresses = await Address.aggregate([
						{
							$match: {
								customer_id: _id,
							},
						},
						// get the location matched for receive region, district, ward
						{
							$lookup: {
								from: 'locations',
								let: {
									region_id: '$region_id',
								},
								pipeline: [
									{
										$match: {
											$expr: { $eq: ['$_id', '$$region_id'] },
										},
									},
								],
								as: 'location',
							},
						},
						{
							$addFields: {
								location: { $arrayElemAt: ['$location', 0] },
							},
						},
						{
							$addFields: {
								country: '$location.country',
								region: {
									name: '$location.name',
									code: '$location.code',
									_id: '$location._id',
								},
								district: {
									$arrayElemAt: [
										{
											$filter: {
												input: '$location.districts',
												cond: {
													$eq: ['$$this._id', '$district_id'],
												},
											},
										},
										0,
									],
								},
							},
						},
						{
							$addFields: {
								ward: {
									$arrayElemAt: [
										{
											$filter: {
												input: '$district.wards',
												cond: {
													$eq: ['$$this._id', '$ward_id'],
												},
											},
										},
										0,
									],
								},
							},
						},
						{
							$project: {
								name: 1,
								company: 1,
								phone_number: 1,
								street: 1,
								delivery_address_type: 1,
								is_default: 1,
								country: 1,
								region: 1,
								district: {
									name: 1,
									code: 1,
									_id: 1,
								},
								ward: 1,
							},
						},
						{
							$sort: { is_default: -1 },
						},
					]);

					dependentDetails['addresses'] = addresses;
					break;
				default:
					break;
			}

			res.status(200).json({
				profile,
				...dependentDetails,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /accounts
	/*
		account_type: String,
		phone_number: String,
		password: String,
		passwordConfirm: String,
		[is_phone_verified]: Bool,
		[email]: String,
		[is_email_verified]: Bool,
		[name]: String,
		[avatar_url]: File,
		[roles]: [String],
	*/
	async create(req, res, next) {
		try {
			const avatar = req.file;
			const { account_type, phone_number, password, passwordConfirm } = req.body;
			const capitalizedType = capitalize(account_type);

			const valueOfTypes = Object.values(Types);
			if (!valueOfTypes.includes(capitalizedType)) {
				next({
					status: 400,
					msg: `Type of ${capitalizedType} not included. Try the following: ${valueOfTypes.join(
						', '
					)} instead!`,
				});
				return;
			}

			const accountExisted = await Account.findOne({ phone_number });
			if (accountExisted) {
				next({ status: 400, msg: 'Account existed!' });
				return;
			}

			if (password !== passwordConfirm) {
				next({ status: 400, msg: 'Password not sync!' });
				return;
			}

			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(password, saltRounds);

			let account = null;
			const details = {
				...req.body,
				password: hashedPassword,
			};
			if (avatar) {
				const { secure_url } = await cloudinaryUpload(avatar.path, 'account');
				details['avatar_url'] = secure_url;
			}

			switch (capitalizedType) {
				case Types.customer:
					account = new Customer(details);
					break;
				case Types.administrator:
					account = new Administrator(details);
					break;
				default:
					next({ status: 400, msg: `Unable to resolve, type of ${capitalizedType} not matched!` });
					return;
			}
			await account.save();

			res.status(201).json({
				msg: 'Create account successfully!',
				account,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [PUT] /accounts/:_id
	/*
		account_type: String,
		phone_number: String,
		password: String,
		passwordConfirm: String,
		[is_phone_verified]: Bool,
		[email]: String,
		[is_email_verified]: Bool,
		[name]: String,
		[avatar_url]: File,
		[roles]: [String],
	*/
	async update(req, res, next) {
		try {
			const avatar = req.file;
			let { _id } = req.params;
			_id = mongoose.Types.ObjectId(_id);
			const { phone_number } = req.body;

			const accountExisted = await Account.findOne({ _id: { $ne: _id }, phone_number });
			if (accountExisted) {
				next({ status: 400, msg: 'Account existed!' });
				return;
			}

			if (avatar) {
				const { secure_url } = await cloudinaryUpload(avatar.path, 'account');
				req.body.avatar_url = secure_url;
			}

			const account = await Account.findByIdAndUpdate(_id, req.body, {
				new: true,
			});

			res.status(201).json({
				msg: 'Update account successfully!',
				account,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /accounts/exist
	/*
		phone_number: String
	*/
	async checkExist(req, res, next) {
		try {
			const { phone_number } = req.body;

			if (!phone_number) {
				next({ status: 400, msg: 'Phone number is required!' });
				return;
			}

			if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone_number)) {
				next({ status: 400, msg: 'Invalid phone number!' });
				return;
			}

			const account = await Account.findOne({ phone_number });

			res.status(200).json(account ? true : false);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /accounts/login
	/*
		phone_number: String,
        password: String,
	*/
	async login(req, res, next) {
		try {
			const { phone_number, password } = req.body;

			const account = await Account.findOne({ phone_number }).select('name password');
			if (!account) {
				next({ status: 400, msg: 'Account not found!' });
				return;
			}

			const isRightPassword = await bcrypt.compare(password, account.password);
			if (!isRightPassword) {
				next({ status: 400, msg: 'Sign in information is incorrect!' });
				return;
			}

			const { _id, name, type } = account;
			const tokens = generateToken({ _id, name, type });
			const { refreshToken } = tokens;
			account.refreshToken = refreshToken;
			await account.save();

			res.status(200).json({
				name,
				tokens,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /accounts/social/login
	/*
		id: String,
	*/
	async socialLogin(req, res, next) {
		// API for accout Customer type only
		try {
			const { id } = req.body;

			const account = await Customer.findOne({ 'social.id': id }).select('name');
			if (!account) {
				next({ status: 400, msg: 'Account not found!' });
				return;
			}

			const { _id, name, type } = account;
			const tokens = generateToken({ _id, name, type });
			const { refreshToken } = tokens;
			account.refreshToken = refreshToken;
			await account.save();

			res.status(200).json({
				name,
				tokens,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /accounts/register
	/*
		account_type: String,
		phone_number: String,
		password: String,
		passwordConfirm: String,
		[is_phone_verified]: Bool,
		[email]: String,
		[is_email_verified]: Bool,
		[name]: String,
		[avatar_url]: String,
		[roles]: [String],
		----Customer----
		[gender]: String,
		[social]: [{
			id: String,
			type: String,
		}]
	*/
	async register(req, res, next) {
		try {
			const { phone_number, password, passwordConfirm } = req.body;

			const accountExisted = await Account.findOne({ phone_number });
			if (accountExisted) {
				next({ status: 400, msg: 'Account existed!' });
				return;
			}

			if (password !== passwordConfirm) {
				next({ status: 400, msg: 'Password not sync!' });
				return;
			}

			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(password, saltRounds);

			let account = null;
			const details = {
				...req.body,
				password: hashedPassword,
			};
			account = new Customer(details);
			await account.save();

			const { _id, name, type } = account;
			const tokens = generateToken({ _id, name, type });
			const { refreshToken } = tokens;
			account.refreshToken = refreshToken;
			await account.save();

			res.status(201).json({
				msg: 'Insert account successfully!',
				name,
				tokens,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /accounts/refreshToken
	/*
		refreshToken: String,
	*/
	async refreshToken(req, res, next) {
		try {
			const { refreshToken } = req.body;

			if (!refreshToken) {
				next({ status: 401, msg: 'Unauthorized' });
				return;
			}

			verify(refreshToken, process.env.REFRESH_SECRET_SIGNATURE);

			const account = await Account.findOne({ refreshToken });
			if (!account) {
				next({ status: 400, msg: 'Refresh token is incorrect!' });
				return;
			}

			const { _id, name, type } = account;
			const tokens = generateToken({ _id, name, type });
			account.refreshToken = tokens.refreshToken;
			await account.save();

			res.status(200).json(tokens);
		} catch (error) {
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /accounts/addresses
	/*
		name: String,
		company: String,
		phone_number: String,
		region_id: ObjectId as String,
		district_id: ObjectId as String,
		ward_id: ObjectId as String,
		street: String,
		delivery_address_type: String,
		is_default: Bool,
	*/
	async insertAddress(req, res, next) {
		try {
			let customer_id = req.account._id;
			customer_id = mongoose.Types.ObjectId(customer_id);
			let { region_id, district_id, ward_id, is_default, ...other } = req.body;
			region_id = mongoose.Types.ObjectId(region_id);
			district_id = mongoose.Types.ObjectId(district_id);
			ward_id = mongoose.Types.ObjectId(ward_id);

			// the first address is always default
			// otherwise if it's default then update everything else to non-default
			const addressCount = await Address.count({
				customer_id,
			});
			if (addressCount === 0) is_default = true;
			else {
				if (is_default)
					await Address.updateMany(
						{
							customer_id,
						},
						{
							is_default: false,
						}
					);
			}

			const address = new Address({
				customer_id,
				region_id,
				district_id,
				ward_id,
				is_default,
				...other,
			});
			await address.save();

			const location = await Location.aggregate([
				{
					$match: { _id: region_id },
				},
				{
					$addFields: {
						country: '$country',
						region: {
							name: '$name',
							code: '$code',
							_id: '$_id',
						},
						district: {
							$arrayElemAt: [
								{
									$filter: {
										input: '$districts',
										cond: {
											$eq: ['$$this._id', district_id],
										},
									},
								},
								0,
							],
						},
					},
				},
				{
					$addFields: {
						ward: {
							$arrayElemAt: [
								{
									$filter: {
										input: '$district.wards',
										cond: {
											$eq: ['$$this._id', ward_id],
										},
									},
								},
								0,
							],
						},
					},
				},
				{
					$project: {
						_id: 0,
						country: 1,
						region: 1,
						district: {
							name: 1,
							code: 1,
							_id: 1,
						},
						ward: 1,
					},
				},
			]);

			res.status(201).json({
				msg: 'Insert address successfully!',
				address: {
					_id: address._id,
					...other,
					...location[0],
					is_default,
				},
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [PATCH] /accounts/addresses/default/:_id
	async switchDefault(req, res, next) {
		try {
			let customer_id = req.account._id;
			customer_id = mongoose.Types.ObjectId(customer_id);
			let { _id } = req.params;
			_id = mongoose.Types.ObjectId(_id);

			await Address.updateMany({ customer_id }, [
				{
					$set: {
						is_default: {
							$eq: ['$_id', _id],
						},
					},
				},
			]);

			res.status(200).json({
				msg: 'Switch default successfully!',
				_id,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [PUT] /accounts/addresses
	/*
		_id: ObjectId as String,
		name: String,
		company: String,
		phone_number: String,
		region_id: ObjectId as String,
		district_id: ObjectId as String,
		ward_id: ObjectId as String,
		street: String,
		delivery_address_type: String,
		is_default: Bool,
	*/
	async editAddress(req, res, next) {
		try {
			let customer_id = req.account._id;
			customer_id = mongoose.Types.ObjectId(customer_id);
			let { _id, region_id, district_id, ward_id, is_default, ...other } = req.body;
			_id = mongoose.Types.ObjectId(_id);
			region_id = mongoose.Types.ObjectId(region_id);
			district_id = mongoose.Types.ObjectId(district_id);
			ward_id = mongoose.Types.ObjectId(ward_id);

			// if it's default then update everything else to non-default
			if (is_default) await Address.updateMany({ customer_id }, { is_default: false });

			const address = await Address.findByIdAndUpdate(
				_id,
				{
					region_id,
					district_id,
					ward_id,
					is_default,
					...other,
				},
				{
					new: true,
				}
			);

			const location = await Location.aggregate([
				{
					$match: { _id: region_id },
				},
				{
					$addFields: {
						country: '$country',
						region: {
							name: '$name',
							code: '$code',
							_id: '$_id',
						},
						district: {
							$arrayElemAt: [
								{
									$filter: {
										input: '$districts',
										cond: {
											$eq: ['$$this._id', district_id],
										},
									},
								},
								0,
							],
						},
					},
				},
				{
					$addFields: {
						ward: {
							$arrayElemAt: [
								{
									$filter: {
										input: '$district.wards',
										cond: {
											$eq: ['$$this._id', ward_id],
										},
									},
								},
								0,
							],
						},
					},
				},
				{
					$project: {
						_id: 0,
						country: 1,
						region: 1,
						district: {
							name: 1,
							code: 1,
							_id: 1,
						},
						ward: 1,
					},
				},
			]);

			res.status(200).json({
				msg: 'Edit address successfully!',
				address: {
					_id: address._id,
					...other,
					...location[0],
					is_default,
				},
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [DELETE] /accounts/addresses/:_id
	async removeAddress(req, res, next) {
		try {
			let customer_id = req.account._id;
			customer_id = mongoose.Types.ObjectId(customer_id);
			let { _id } = req.params;
			_id = mongoose.Types.ObjectId(_id);

			const result = await Address.deleteOne({ _id, customer_id });

			res.status(200).json({
				msg: 'Remove address successfully!',
				_id,
				removed_count: result.deletedCount,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}
}

module.exports = new AccountsAPI();
