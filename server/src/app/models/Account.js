var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Types = { customer: 'Customer', administrator: 'Administrator' };

const Account = new Schema(
	{
		phone_number: { type: String, required: true, unique: true },
		is_phone_verified: { type: Boolean, default: false },
		password: { type: String, required: true },
		email: { type: String, default: '' },
		is_email_verified: { type: Boolean, default: false },
		name: { type: String, default: '' },
		avatar_url: { type: String, default: null },
		refreshToken: { type: String, default: null },
		roles: { type: [String], default: [] },
	},
	{
		timestamps: true,
		discriminatorKey: 'type',
	}
);
const Base = mongoose.model('Account', Account);

const Customer = Base.discriminator(
	Types.customer,
	new Schema({
		gender: { type: String, default: '' },
		social: [
			{
				_id: false,
				id: { type: String, default: null },
				type: { type: String, default: '' },
			},
		],
	})
);

const Administrator = Base.discriminator(
	Types.administrator,
	new Schema({
		test: { type: String, default: '' },
	})
);

module.exports = {
	Types,
	Account: Base,
	Customer,
	Administrator,
};
