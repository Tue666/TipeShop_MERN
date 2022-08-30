const mongoose = require('mongoose');

// models
const Resource = require('../models/Resource');

class ResourcesAPI {
	// [GET] /resources/nested
	async findAllWithNested(req, res, next) {
		try {
			const resources = await Resource.aggregate([
				{
					$match: { parent_id: null },
				},
				{
					$graphLookup: {
						from: 'resources',
						startWith: '$_id',
						connectFromField: '_id',
						connectToField: 'parent_id',
						maxDepth: 4,
						depthField: 'level',
						as: 'children',
					},
				},
				// must unwind & sort to get all the children descending by level for algorithmic purpose
				{
					$unwind: {
						path: '$children',
						preserveNullAndEmptyArrays: true,
					},
				},
				{ $sort: { 'children.level': -1 } },
				// get the operations of children
				{
					$lookup: {
						from: 'operations',
						localField: 'children.operations',
						foreignField: '_id',
						as: 'child_operations',
					},
				},
				{
					$group: {
						_id: '$_id',
						name: { $first: '$name' },
						description: { $first: '$description' },
						parent_id: { $first: '$parent_id' },
						operations: { $first: '$operations' },
						locked: { $first: '$locked' },
						children: {
							$push: {
								$cond: {
									if: { $gt: ['$children._id', 0] },
									then: {
										_id: '$children._id',
										name: '$children.name',
										description: '$children.description',
										parent_id: '$children.parent_id',
										operations: '$child_operations',
										locked: '$children.locked',
										level: '$children.level',
									},
									else: '$$REMOVE',
								},
							},
						},
					},
				},
				{
					$sort: { _id: 1 },
				},
				{
					$addFields: {
						children: {
							$reduce: {
								input: '$children',
								initialValue: { level: -1, prevChild: [], presentChild: [] },
								in: {
									$let: {
										vars: {
											prev: {
												$cond: {
													if: { $eq: ['$$value.level', '$$this.level'] },
													then: '$$value.prevChild', // keep the same as before if same level
													else: '$$value.presentChild', // present child will become previouse child for nested purpose
												},
											},
											current: {
												$cond: {
													if: { $eq: ['$$value.level', '$$this.level'] },
													then: '$$value.presentChild', // keep the same as before if same level
													else: [], // recreate nested child
												},
											},
										},
										in: {
											level: '$$this.level', // update level for condition purpose
											prevChild: '$$prev',
											presentChild: {
												// present = current + { ...this, children: [childs that have parent_id equal to this._id] }
												$concatArrays: [
													'$$current',
													[
														{
															$mergeObjects: [
																'$$this',
																{
																	children: {
																		$filter: {
																			input: '$$prev',
																			as: 'p',
																			cond: { $eq: ['$$p.parent_id', '$$this._id'] },
																		},
																	},
																},
															],
														},
													],
												],
											},
										},
									},
								},
							},
						},
					},
				},
				{
					$addFields: {
						children: '$children.presentChild',
					},
				},
				// array to object with key is _id
				// {
				// 	$group: {
				// 		_id: null,
				// 		temp: {
				// 			$push: { k: '$_id', v: '$$ROOT' },
				// 		},
				// 	},
				// },
				// {
				// 	$replaceRoot: {
				// 		newRoot: {
				// 			$arrayToObject: '$temp',
				// 		},
				// 	},
				// },
			]);

			res.status(200).json(resources);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /resources/exist
	/*
		names: String[]
	*/
	async checkExist(req, res, next) {
		try {
			const { names } = req.body;

			const resourcesExist = await Resource.find({ name: { $in: names } });

			res.status(200).json({
				exist: resourcesExist.length > 0 ? true : false,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /resources
	/*
        name: String,
        [description]: String,
        [parent_id]: String,
        [operations]: [operations._id],
        [locked]: Boolean,
    */
	async create(req, res, next) {
		try {
			let { name, operations, ...others } = req.body;

			if (!name) {
				next({ status: 400, msg: 'Resource name is required!' });
				return;
			}
			name = name.toLowerCase();

			const resourceExisted = await Resource.findOne({ name });
			if (resourceExisted) {
				next({ status: 400, msg: 'Resource existed!' });
				return;
			}

			if (operations) {
				others.operations = operations.map((operation) => mongoose.Types.ObjectId(operation));
			}

			const resource = new Resource({
				name,
				...others,
			});
			await resource.save();
			await resource.populate('operations');

			res.status(201).json({
				msg: 'Insert resource successfully!',
				resource,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [PUT] /resources/:_id
	/*
        name: String,
        [description]: String,
        [parent_id]: String,
        [operations]: [operations._id],
        [locked]: Boolean,
    */
	async update(req, res, next) {
		try {
			const { _id } = req.params;
			let { name, operations, ...others } = req.body;

			if (!name) {
				next({ status: 400, msg: 'Resource name is required!' });
				return;
			}
			name = name.toLowerCase();

			const resourceExisted = await Resource.findOne({ _id: { $ne: _id }, name });
			if (resourceExisted) {
				next({ status: 400, msg: 'Resource existed!' });
				return;
			}

			if (operations) {
				others.operations = operations.map((operation) => mongoose.Types.ObjectId(operation));
			}

			const resource = await Resource.findByIdAndUpdate(
				_id,
				{
					name,
					...others,
				},
				{
					new: true,
				}
			).populate('operations');

			res.status(201).json({
				msg: 'Edit resource successfully!',
				resource,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [PATCH] /resources/lock/:_id
	async editLocked(req, res, next) {
		try {
			const { _id } = req.params;

			await Resource.findByIdAndUpdate(_id, [
				{
					$set: {
						locked: { $not: '$locked' },
					},
				},
			]);

			res.status(200).json({
				msg: 'Update lock resource successfully!',
				_id,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}
}

module.exports = new ResourcesAPI();
