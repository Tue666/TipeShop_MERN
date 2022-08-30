const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const Resource = new Schema(
	{
		_id: { type: String },
		name: { type: String, required: true, unique: true },
		description: { type: String, default: '' },
		parent_id: { type: String, default: null },
		operations: [{ type: mongoose.Types.ObjectId, ref: 'Operation', default: [] }],
		locked: { type: Boolean, default: false },
	},
	{
		_id: false,
		timestamps: true,
	}
);

Resource.pre('save', function (next) {
	if (!this.isNew) {
		next();
		return;
	}
	this._id = this.name;
	next();
});

Resource.plugin(mongooseDelete, {
	deletedAt: true,
	deletedBy: true,
	deletedByType: {
		name: { type: String },
	},
	overrideMethods: true,
});

module.exports = mongoose.model('Resource', Resource);
