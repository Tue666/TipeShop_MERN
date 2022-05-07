const mongoose = require('mongoose');

// models
const Product = require('../models/Product');
const AttributeValue = require('../models/AttributeValue');
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

	// [POST] /products/filtered
	async findFilteredProducts(req, res, next) {
		try {
			const { categoryIds, take, query } = req.body;
			let { page, sort, price, rating, ...externalFilter } = query;
			page = page ? parseInt(page) : 1;

			// sorting
			let direction = -1; // default is descending
			switch (sort) {
				case 'top_seller':
					sort = 'quantity_sold.value';
					break;
				case 'newest':
					sort = 'updatedAt';
					break;
				case 'price-asc':
				case 'price-desc':
					const [tag, direc] = sort.split('-');
					sort = tag;
					direction = direc === 'asc' ? 1 : -1;
					break;
				default:
					sort = 'createdAt'; // default sort by new created
			}

			// pricing
			const [fromPrice, toPrice] = price?.split(',').map((p) => Number(p)) || [0, 10000000000];

			// rating
			const [fromStar, toStar] = rating ? [rating - 0.9, rating] : [0, 5];

			let filterIds = [];
			await Promise.all(
				Object.keys(externalFilter).map(async (key) => {
					const values = externalFilter[key].split(',').map((value) => value.trim());
					await Promise.all(
						values.map(async (value) => {
							const attributeValue = await AttributeValue.findOne({
								attribute_query_name: key,
								query_value: value,
							});
							attributeValue && filterIds.push(attributeValue._id);
						})
					);
				})
			);

			const commonFilter = {
				category: { $in: categoryIds },
				price: {
					$gte: fromPrice,
					$lte: toPrice,
				},
				rating_average: {
					$gte: fromStar,
					$lte: toStar,
				},
				inventory_status: 'availabel',
			};

			const result = await Product.aggregate([
				{
					$match: {
						...commonFilter,
						attribute_values: filterIds.length > 0 ? { $all: filterIds } : { $exists: true },
					},
				},
				{
					$lookup: {
						from: 'attributevalues',
						localField: 'attribute_values',
						foreignField: '_id',
						as: 'attribute_values',
					},
				},
				{
					$facet: {
						products: [
							{ $sort: { [sort]: direction } },
							{ $skip: (page - 1) * take },
							{ $limit: take },
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
									rating_average: 1,
								},
							},
						],
						total: [
							{
								$group: {
									_id: null,
									count: {
										$sum: 1,
									},
								},
							},
						],
						filter: [
							{
								$unwind: '$attribute_values',
							},
							{
								$group: {
									_id: '$attribute_values',
								},
							},
							{
								$group: {
									_id: null,
									values: {
										$addToSet: '$_id',
									},
									attributes: {
										$addToSet: '$_id.attribute_query_name',
									},
								},
							},
							{
								$lookup: {
									from: 'attributes',
									localField: 'attributes',
									foreignField: 'query_name',
									as: 'attributes',
								},
							},
							{
								$addFields: {
									attributes: {
										// map and push value filtered to attribute object
										$map: {
											input: '$attributes',
											as: 'attribute',
											in: {
												$mergeObjects: [
													'$$attribute',
													{
														values: {
															$filter: {
																input: '$values',
																as: 'value',
																cond: {
																	$eq: ['$$value.attribute_query_name', '$$attribute.query_name'],
																},
															},
														},
													},
												],
											},
										},
									},
								},
							},
							{
								$project: {
									attributes: {
										_id: 1,
										query_name: 1,
										display_name: 1,
										collapsed: 1,
										multi_select: 1,
										values: {
											_id: 1,
											display_value: 1,
											query_value: 1,
										},
									},
								},
							},
						],
					},
				},
				{
					$project: {
						products: 1,
						total: '$total.count',
						filter: '$filter.attributes',
					},
				},
			]);

			const { products, total, filter } = result[0];
			const count = total[0] ? total[0] : 0;
			const totalPage = Math.ceil(count / take);

			res.json({
				products,
				totalProduct: count,
				filter: filter[0],
				pagination: {
					totalPage,
					page,
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
					$match: { inventory_status: 'availabel' },
				},
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
						rating_average: 1,
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
