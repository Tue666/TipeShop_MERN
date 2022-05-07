var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const AttributeValue = new Schema({
	attribute_query_name: { type: String, required: true },
	display_value: { type: String, required: true },
	query_value: { type: String, required: true },
});

module.exports = mongoose.model('AttributeValue', AttributeValue);
