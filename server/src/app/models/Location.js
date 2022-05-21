var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Ward
const Ward = new Schema({
	name: { type: String, required: true },
	code: { type: String, required: true },
});

// District
const District = new Schema({
	name: { type: String, required: true },
	code: { type: String, required: true },
	wards: {
		type: [Ward],
		default: null,
	},
});

// Region
const Location = new Schema({
	name: { type: String, required: true },
	code: { type: String, required: true },
	country: { type: String, required: true },
	districts: {
		type: [District],
		default: null,
	},
});

module.exports = mongoose.model('Location', Location);
