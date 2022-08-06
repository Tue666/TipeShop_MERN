const mongoose = require('mongoose');

// models
const Operation = require('../models/Operation');

class OperationsAPI {
	// [GET] /operations
	async findAll(req, res, next) {
		try {
			const operations = await Operation.find({});
			res.status(200).json(operations);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /operations
	/*
        object: String,
        [description]: String,
        [actions]: [String],
    */
	async insert(req, res, next) {
		try {
			const operation = new Operation(req.body);
			await operation.save();
			res.status(201).json({
				msg: 'Insert operation successfully!',
				operation,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [PATCH] /operations/lock/:_id
	async editLocked(req, res, next) {
		try {
			let { _id } = req.params;
			_id = mongoose.Types.ObjectId(_id);

			await Operation.findByIdAndUpdate(_id, [
				{
					$set: {
						locked: { $not: '$locked' },
					},
				},
			]);

			res.status(200).json({
				msg: 'Update lock operation successfully!',
				_id,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}
}

module.exports = new OperationsAPI();
