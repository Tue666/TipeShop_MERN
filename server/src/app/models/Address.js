var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Address = new Schema(
	{
		customer_id: { type: mongoose.Types.ObjectId, ref: 'Account', required: true },
		name: { type: String, required: true },
		phone_number: { type: String, required: true },
		region_id: { type: String, required: true },
		district_id: { type: String, required: true },
		ward_id: { type: String, required: true },
		street: { type: String, required: true },
		company: { type: String, default: null },
		delivery_address_type: { type: String, default: 'home' },
		is_default: { type: Boolean },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Address', Address);
