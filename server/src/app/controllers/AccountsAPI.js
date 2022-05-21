const bcrypt = require('bcrypt');

// models
const Account = require('../models/Account');

class AccountsAPI {
	// [POST] /accounts/exist
	/*
		phone_number: String
	*/
	async checkExist(req, res, next) {
		try {
			const { phone_number } = req.body;

			// check phone number not empty
			if (!phone_number) {
				next({ status: 400, msg: 'Phone number is required!' });
				return;
			}

			// check phone number valid
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

	// [POST] /accounts/register
	/*
		phone: String,
        password: String,
	*/
	async register(req, res, next) {
		try {
			const { phone_number, password } = req.body;

			const accountExisted = await Account.findOne({ phone_number });
			if (accountExisted) {
				next({ status: 400, msg: 'Account existed!' });
				return;
			}

			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(password, saltRounds);
			const account = new Account({
				...req.body,
				name: phone_number,
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
}

module.exports = new AccountsAPI();
