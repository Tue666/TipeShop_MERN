const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const Operation = new Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String, default: '' },
	locked: { type: Boolean, default: false },
});

Operation.post('deleteOne', async function () {
	const deletedId = this.getQuery()['_id'];
	// delete this operation contained in resources
	await mongoose.model('Resource').updateMany(
		{},
		{
			$pull: { operations: mongoose.Types.ObjectId(deletedId) },
		}
	);
	// delete this operation contained in every permission of roles
	await mongoose.model('Role').updateMany(
		{},
		{
			$pull: { 'permissions.$[permission].operations': mongoose.Types.ObjectId(deletedId) },
		},
		{
			arrayFilters: [
				{
					'permission.operations': {
						$ne: [],
					},
				},
			],
		}
	);
});

Operation.plugin(mongooseDelete, {
	deletedAt: true,
	deletedBy: true,
	deletedByType: {
		name: { type: String },
	},
	overrideMethods: true,
});

module.exports = mongoose.model('Operation', Operation);
