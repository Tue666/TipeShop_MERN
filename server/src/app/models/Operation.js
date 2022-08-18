var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Operation = new Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String, default: '' },
	locked: { type: Boolean, default: false },
});

module.exports = mongoose.model('Operation', Operation);
