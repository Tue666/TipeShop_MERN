var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Warranty = new Schema(
	{
		name: { type: String, required: true },
		value: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Warranty', Warranty);
