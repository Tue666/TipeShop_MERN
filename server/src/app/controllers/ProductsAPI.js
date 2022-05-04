const mongoose = require('mongoose');

// models
const Product = require('../models/Product');
// utils
const cloudinaryUpload = require('../../utils/cloudinaryUpload');

class ProductsAPI {
	// [GET] /products/:page/:number
	/*
		page: Number,
		number: Number
	*/
	async findAllWithPagination(req, res) {
		try {
			let { page, number } = req.params;
			page = parseInt(page);
			number = parseInt(number);

			const totalProduct = await Product.count({ inventory_status: 'availabel' });
			const totalPage = Math.ceil(totalProduct / number);
			const products = await Product.find({ inventory_status: 'availabel' })
				.skip((page - 1) * number)
				.limit(number);
			res.status(200).json({
				products,
				pagination: {
					totalPage,
					currentPage: page,
				},
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [GET] /products/ranking/:type/:number
	/*
		type: String [sold, view, favorite],
		number: Number,
	*/
	async findRankingProducts(req, res, next) {
		try {
			let { type, number } = req.params;
			number = parseInt(number);

			const GRAVITY = 1.8;
			const products = await Product.aggregate([
				{
					$addFields: {
						time_elapsed: {
							$divide: [{ $subtract: ['$$NOW', '$updatedAt'] }, 3600000],
						},
					},
				},
				{
					$project: {
						name: 1,
						images: 1,
						discount: 1,
						discount_rate: 1,
						original_price: 1,
						price: 1,
						slug: 1,
						quantity_sold: 1,
						score: {
							// HackerNews sort algorithm
							/*
								score = voted / (t + 2)^G
								- voted: The voted count such as sold, viewed, favorite.
								- t: Time between post(update) time and current time (in hours).
								- G: Constant 'gravity', default is 1.8.
							*/
							$divide: [
								type === 'sold' ? '$quantity_sold.value' : type === 'favorite' ? '$favorite_count' : '$view_count',
								{
									$pow: [{ $add: ['$time_elapsed', 2] }, GRAVITY],
								},
							],
						},
					},
				},
				{
					$sort: {
						score: -1,
					},
				},
				{
					$limit: number,
				},
			]);
			res.status(200).json(products);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /products
	/*
		name: String,
		images: [String],
		quantity: Number,
		category: Number,
		[attribute_values]: [attribute_value._id],
		[warranty_infor]: [warranty._id],
		[specifications]: [specification._id],
		...
	*/
	async insert(req, res, next) {
		try {
			const { warranty_infor, specifications, ...body } = req.body;
			const images = req.files;

			// handle images
			if (!images) {
				next({ status: 400, msg: 'Image field is required!' });
				return;
			}
			const imageObjs = [];
			await Promise.all(
				images.map(async (file) => {
					const { public_id } = await cloudinaryUpload(file.path, 'product');
					imageObjs.push(public_id);
				})
			);

			// handle warranty
			const warrantyObjs = [];
			warranty_infor &&
				warranty_infor.map((warranty) => {
					warrantyObjs.push(mongoose.Types.ObjectId(warranty));
				});

			// handle specification
			const specificationObjs = [];
			specifications &&
				specifications.map((specification) => {
					specificationObjs.push(mongoose.Types.ObjectId(specification));
				});

			const product = new Product({
				...body,
				images: imageObjs,
				warranty_infor: warrantyObjs,
				specifications: specificationObjs,
			});
			await product.save();
			res.status(201).json({
				msg: 'Insert product successfully!',
				product,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}
}

module.exports = new ProductsAPI();
