var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Counter = new Schema({
	_id: { type: String, required: true },
	seq: { type: Number, default: 0 },
});

const counterModel = mongoose.model('Counter', Counter);

const autoIncrementModelID = async function (modelName, doc, next) {
	try {
		const counter = await counterModel.findByIdAndUpdate(
			{ _id: modelName },
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true }
		);
		doc._id = counter.seq;
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = autoIncrementModelID;
