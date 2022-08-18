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
				{
					$group: {
						_id: null,
						temp: {
							$push: { k: '$_id', v: '$$ROOT' },
						},
					},
				},
				{
					$replaceRoot: {
						newRoot: {
							$arrayToObject: '$temp',
						},
					},
				},
			]);

			res.status(200).json(resources.length > 0 ? resources[0] : []);
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
	async insert(req, res, next) {
		try {
			let { name, operations, ...others } = req.body;
			name = name.toLowerCase();

			const operationObjs = [];
			operations &&
				operations.map((operation) => {
					operationObjs.push(mongoose.Types.ObjectId(operation));
				});

			const resource = new Resource({
				name,
				operations: operationObjs,
				...others,
			});
			await resource.save();

			res.status(201).json({
				msg: 'Insert resource successfully!',
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
