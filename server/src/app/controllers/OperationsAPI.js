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

	// [GET] /operations/deleted
	async findAllDeleted(req, res, next) {
		try {
			const operations = await Operation.findDeleted({});
			res.status(200).json(operations);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /operations/exist
	/*
		names: String[]
	*/
	async checkExist(req, res, next) {
		try {
			const { names } = req.body;

			const operationsExist = await Operation.find({ name: { $in: names } });

			res.status(200).json({
				exist: operationsExist.length > 0 ? true : false,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /operations
	/*
        name: String,
        [description]: String,
		[locked]: Boolean,
    */
	async create(req, res, next) {
		try {
			let { name, ...others } = req.body;

			if (!name) {
				next({ status: 400, msg: 'Operation name is required!' });
				return;
			}
			name = name.toLowerCase();

			const operationExisted = await Operation.findOneWithDeleted({ name });
			if (operationExisted?.deleted) {
				next({ status: 405, msg: 'Operation existed in recycle bin!' });
				return;
			}
			if (operationExisted) {
				next({ status: 400, msg: 'Operation existed!' });
				return;
			}

			const operation = new Operation({
				name,
				...others,
			});
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

	// [PUT] /operations/:_id
	/*
        name: String,
        [description]: String,
		[locked]: Boolean,
    */
	async update(req, res, next) {
		try {
			let { _id } = req.params;
			_id = mongoose.Types.ObjectId(_id);
			let { name, ...others } = req.body;

			if (!name) {
				next({ status: 400, msg: 'Operation name is required!' });
				return;
			}
			name = name.toLowerCase();

			const operationExisted = await Operation.findOneWithDeleted({ _id: { $ne: _id }, name });
			if (operationExisted) {
				next({ status: 400, msg: 'Operation existed!' });
				return;
			}

			const operation = await Operation.findByIdAndUpdate(
				_id,
				{
					name,
					...others,
				},
				{
					new: true,
				}
			);

			res.status(201).json({
				msg: 'Edit operation successfully!',
				operation,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [DELETE] /operations/:_id
	async delete(req, res, next) {
		try {
			const deletedBy = {
				_id: mongoose.Types.ObjectId(req.account._id),
				name: req.account.name,
			};
			let { _id } = req.params;
			_id = mongoose.Types.ObjectId(_id);

			await Operation.deleteById(_id, deletedBy);

			res.status(200).json({
				msg: 'Delete operation successfully!',
				deletedId: _id,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [PATCH] /operations/restore/:_id
	async restore(req, res, next) {
		try {
			let { _id } = req.params;
			_id = mongoose.Types.ObjectId(_id);

			const operationDeleted = await Operation.findOneDeleted({ _id });

			await Operation.restore({ _id });

			res.status(200).json({
				msg: 'Restore operation successfully!',
				operation: operationDeleted,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [DELETE] /operations/destroy/:_id
	async destroy(req, res, next) {
		try {
			let { _id } = req.params;
			_id = mongoose.Types.ObjectId(_id);

			await Operation.deleteOne({ _id });

			res.status(200).json({
				msg: 'Permanently delete operation successfully!',
				deletedId: _id,
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
