var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Attribute = new Schema({
	query_name: { type: String, required: true, unique: true },
	display_name: { type: String, required: true },
	collapsed: { type: Number, default: 0 },
	multi_select: { type: Boolean, default: false },
	value_type: { type: String, default: 'Auto' },
});

module.exports = mongoose.model('Attribute', Attribute);
