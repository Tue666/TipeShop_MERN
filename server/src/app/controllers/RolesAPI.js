// models
const Role = require('../models/Role');

class RolesAPI {
	// [POST] /roles
	/*
        name: String,
        [permissions]: [
            {
                resource: String,
                operations: [String],
            }
        ]
    */
	async insert(req, res, next) {
		try {
			const { name } = req.body;

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
}

module.exports = new RolesAPI();
