const mongoose = require('mongoose');

// models
const Role = require('../models/Role');

class RolesAPI {
	// [GET] /roles
	async findAll(req, res, next) {
		try {
			const roles = await Role.aggregate([
				{
					$unwind: '$permissions',
				},
				{
					$lookup: {
						from: 'operations',
						let: {
							operationIds: '$permissions.operations',
						},
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [{ $in: ['$_id', '$$operationIds'] }, { $eq: ['$deleted', false] }],
									},
								},
							},
						],
						as: 'operations',
					},
				},
				{
					$group: {
						_id: '$_id',
						name: { $first: '$name' },
						description: { $first: '$description' },
						permissions: {
							$push: {
								resource: '$permissions.resource',
								operations: {
									$map: {
										input: '$operations',
										as: 'operation',
										in: '$$operation._id',
									},
								},
							},
						},
					},
				},
			]);
			res.status(200).json(roles);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /roles/exist
	/*
		names: String[]
	*/
	async checkExist(req, res, next) {
		try {
			const { names } = req.body;

			const rolesExist = await Role.find({ name: { $in: names } });

			res.status(200).json({
				exist: rolesExist.length > 0 ? true : false,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /roles
	/*
        name: String,
		[description]: String,
        [permissions]: [
            {
                resource: [resource._id],
                [operations]: [operation._id],
            }
        ]
    */
	async create(req, res, next) {
		try {
			const { name } = req.body;

			if (!name) {
				next({ status: 400, msg: 'Role name is required!' });
				return;
			}

			const roleExisted = await Role.findOne({ name });
			if (roleExisted) {
				next({ status: 400, msg: 'Role existed!' });
				return;
			}

			const role = new Role(req.body);
			await role.save();
			res.status(201).json({
				msg: 'Insert role successfully!',
				role,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [PUT] /roles/:_id
	/*
        name: String,
        [description]: String,
        [permissions]: [
            {
                resource: [resource._id],
                [operations]: [operation._id],
            }
        ]
    */
	async update(req, res, next) {
		try {
			let { _id } = req.params;
			_id = mongoose.Types.ObjectId(_id);
			const { name } = req.body;

			if (!name) {
				next({ status: 400, msg: 'Role name is required!' });
				return;
			}

			const roleExisted = await Role.findOne({ _id: { $ne: _id }, name });
			if (roleExisted) {
				next({ status: 400, msg: 'Role existed!' });
				return;
			}

			const role = await Role.findByIdAndUpdate(_id, req.body, {
				new: true,
			});

			res.status(201).json({
				msg: 'Edit role successfully!',
				role,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}
}

module.exports = new RolesAPI();
