var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Address = new Schema(
	{
		customer_id: { type: mongoose.Types.ObjectId, ref: 'Account', required: true },
		name: { type: String, required: true },
		company: { type: String, default: '' },
		phone_number: { type: String, required: true },
		region_id: { type: mongoose.Types.ObjectId, ref: 'Location', required: true },
		district_id: { type: mongoose.Types.ObjectId, ref: 'Location', required: true },
		ward_id: { type: mongoose.Types.ObjectId, ref: 'Location', required: true },
		street: { type: String, required: true },
		delivery_address_type: { type: String, default: 'home' },
		is_default: { type: Boolean },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Address', Address);
