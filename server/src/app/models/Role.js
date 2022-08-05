var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Role = new Schema({
	name: { type: String, required: true },
	permissions: {
		type: [
			{
				object: { type: String, required: true },
				actions: { type: Map, of: Boolean, default: {} },
			},
		],
		default: [],
	},
});

module.exports = mongoose.model('Role', Role);
