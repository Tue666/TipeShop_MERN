var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Role = new Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String, default: '' },
	permissions: {
		type: [
			{
				_id: false,
				resource: [{ type: String, required: true, ref: 'Resource' }],
				operations: [{ type: String, default: [], ref: 'Operation' }],
			},
		],
		default: [],
	},
});

module.exports = mongoose.model('Role', Role);
