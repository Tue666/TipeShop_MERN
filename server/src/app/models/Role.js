const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const Role = new Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String, default: '' },
	permissions: {
		type: [
			{
				_id: false,
				resource: [{ type: String, required: true, ref: 'Resource' }],
				operations: [{ type: mongoose.Types.ObjectId, default: [], ref: 'Operation' }],
			},
		],
		default: [],
	},
});

Role.plugin(mongooseDelete, {
	deletedAt: true,
	deletedBy: true,
	deletedByType: {
		name: { type: String },
	},
	overrideMethods: true,
});

module.exports = mongoose.model('Role', Role);
