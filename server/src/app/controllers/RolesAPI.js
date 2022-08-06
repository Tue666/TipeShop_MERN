// models
const Role = require('../models/Role');

class RolesAPI {
	// [POST] /roles
	/*
        name: String,
        [permissions]: [
            {
                object: String,
                actions: [String],
            }
        ]
    */
	async insert(req, res, next) {
		try {
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
