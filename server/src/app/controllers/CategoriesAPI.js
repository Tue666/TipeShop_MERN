const mongoose = require('mongoose');

// models
const Category = require('../models/Category');
// utils
const cloudinaryUpload = require('../../utils/cloudinaryUpload');

class CategoriesAPI {
	// [POST] /categories
	/*
		name: String,
		image: String,
		[parent_id]: Number,
		[banners]: [String],
		[attributes]: Array[attribute._id],
		...
	*/
	async insert(req, res, next) {
		try {
			const { attributes, ...body } = req.body;
			const { image, banners } = req.files;

			// handle image
			if (!req.files['image']) {
				next({ status: 400, msg: 'Image field is required!' });
				return;
			}
			const { public_id } = await cloudinaryUpload(image[0].path, 'category');

			// // handle banners
			const bannerObjs = [];
			banners &&
				(await Promise.all(
					banners.map(async (file) => {
						const { public_id } = await cloudinaryUpload(file.path, 'category/banners');
						bannerObjs.push(public_id);
					})
				));

			// handle attributes
			const attributeObjs = [];
			attributes &&
				attributes.map((attribute) => {
					attributeObjs.push(mongoose.Types.ObjectId(attribute));
				});

			const category = new Category({
				...body,
				image: public_id,
				banners: bannerObjs,
				attributes: attributeObjs,
			});
			await category.save();
			res.status(200).json({
				msg: 'Insert category successfully!',
				category,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}
}

module.exports = new CategoriesAPI();
