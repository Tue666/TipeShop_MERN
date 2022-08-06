var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Operation = new Schema({
	object: { type: String, required: true },
	description: { type: String, default: '' },
	actions: { type: [String], default: [] },
	locked: { type: Boolean, default: false },
});

module.exports = mongoose.model('Operation', Operation);
