// models
const Category = require('../models/Category');
// utils
const cloudinaryUpload = require('../../utils/cloudinaryUpload');

class CategoriesAPI {
	// [GET] /categories
	async findAllRoot(req, res, next) {
		try {
			const categories = await Category.find({
				parent_id: null,
				status: 'active',
			}).select('_id name image slug');
			res.status(200).json(categories);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [GET] /categories/:_id
	/*
		_id: Number
	*/
	async findById(req, res, next) {
		try {
			let { _id } = req.params;
			_id = parseInt(_id);

			const result = await Category.aggregate([
				{
					$match: {
						_id,
						status: 'active',
					},
				},
				{
					// get all parent of category
					$graphLookup: {
						from: 'categories',
						startWith: '$parent_id',
						connectFromField: 'parent_id',
						connectToField: '_id',
						as: 'parent',
					},
				},
				{
					// get all children of category
					$lookup: {
						from: 'categories',
						localField: '_id',
						foreignField: 'parent_id',
						as: 'children',
					},
				},
				{
					$project: {
						name: 1,
						image: 1,
						banners: 1,
						slug: 1,
						parent: {
							_id: 1,
							name: 1,
							slug: 1,
						},
						children: {
							_id: 1,
							name: 1,
							slug: 1,
						},
					},
				},
			]);
			const category = result[0];
			res.status(200).json(category);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /categories
	/*
		name: String,
		image: String,
		[parent_id]: Number,
		[banners]: [String],
		...
	*/
	async create(req, res, next) {
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

			const category = new Category({
				...body,
				image: public_id,
				banners: bannerObjs,
			});
			await category.save();
			res.status(201).json({
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
