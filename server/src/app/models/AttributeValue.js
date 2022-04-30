var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const autoIncrementModelID = require('./Counter');

const AttributeValue = new Schema({
	_id: { type: Number }, // query_value
	attribute_query_name: { type: String, required: true },
	display_value: { type: String, required: true },
});

AttributeValue.pre('save', function (next) {
	if (!this.isNew) {
		next();
		return;
	}
	autoIncrementModelID('attribute_values', this, next);
});

module.exports = mongoose.model('AttributeValue', AttributeValue);
