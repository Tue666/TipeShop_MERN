var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Account = new Schema(
	{
		phone_number: { type: String, required: true, unique: true },
		is_phone_verified: { type: Boolean, default: false },
		password: { type: String, required: true },
		avatar_url: { type: String, default: '_external_/avatar/avatar.png' },
		email: { type: String, default: '' },
		is_email_verified: { type: Boolean, default: false },
		name: { type: String, default: '' },
		gender: { type: String, default: '' },
		type: { type: String, default: 'Customer' },
		refreshToken: { type: String, default: null },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Account', Account);
