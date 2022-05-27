const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// models
const Account = require('../models/Account');
// utils
const { generateToken, verify } = require('../../utils/jwt');

class AccountsAPI {
	// [GET] /accounts/profile
	async getProfile(req, res, next) {
		try {
			const { _id } = req.account;

			const result = await Account.aggregate([
				{
					$match: { _id: mongoose.Types.ObjectId(_id) },
				},
				{
					$lookup: {
						from: 'addresses',
						localField: '_id',
						foreignField: 'customer_id',
						as: 'addresses',
					},
				},
				{
					$project: {
						password: 0,
						refreshToken: 0,
						__v: 0,
					},
				},
			]);

			const { addresses, ...profile } = result[0];

			res.status(200).json({
				profile,
				addresses,
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

			res.json(account ? true : false);
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

			const account = await Account.findOne({ phone_number });
			if (!account) {
				next({ status: 400, msg: 'Account not found!' });
				return;
			}

			const isRightPassword = await bcrypt.compare(password, account.password);
			if (!isRightPassword) {
				next({ status: 400, msg: 'Sign in information is incorrect!' });
				return;
			}

			const { _id, name } = account;
			const tokens = generateToken({ _id, name });
			const { refreshToken } = tokens;
			account.refreshToken = refreshToken;
			await account.save();

			res.json({
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
		phone_number: String,
		name: String,
        password: String,
		passwordConfirm: String,
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
			const account = new Account({
				...req.body,
				password: hashedPassword,
			});
			await account.save();

			res.status(201).json({
				msg: 'Insert account successfully!',
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

			const { _id, name } = account;
			const tokens = generateToken({ _id, name });
			account.refreshToken = tokens.refreshToken;
			await account.save();

			res.json(tokens);
		} catch (error) {
			next({ status: 500, msg: error.message });
		}
	}
}

module.exports = new AccountsAPI();
