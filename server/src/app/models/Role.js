var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Role = new Schema({
	name: { type: String, required: true, unique: true },
	permissions: {
		type: [
			{
				_id: false,
				object: { type: String, required: true },
				actions: { type: [String], default: [] },
			},
		],
		default: [],
	},
});

module.exports = mongoose.model('Role', Role);
