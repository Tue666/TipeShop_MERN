const mongoose = require('mongoose');

// models
const Product = require('../models/Product');
const AttributeValue = require('../models/AttributeValue');
// utils
const cloudinaryUpload = require('../../utils/cloudinaryUpload');

class ProductsAPI {
	// [GET] /products
	async findAll(req, res, next) {
		try {
			const data = await Product.find({})
				.populate({
					path: 'category',
					select: 'name image',
				})
				.populate({
					path: 'attribute_values',
					select: 'display_value query_value',
				});

			res.status(200).json(data);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [GET] /products/:_id
	async findById(req, res, next) {
		try {
			let { _id } = req.params;
			_id = mongoose.Types.ObjectId(_id);

			const result = await Product.aggregate([
				{
					$match: {
						_id,
						inventory_status: 'availabel',
					},
				},
				{
					$graphLookup: {
						from: 'categories',
						startWith: '$category',
						connectFromField: 'parent_id',
						connectToField: '_id',
						as: 'breadcrumbs',
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
					$lookup: {
						from: 'warranties',
						localField: 'warranty_infor',
						foreignField: '_id',
						as: 'warranty_infor',
					},
				},
				{
					$lookup: {
						from: 'specifications',
						localField: 'specifications',
						foreignField: '_id',
						as: 'specifications',
					},
				},
				{
					$project: {
						'attribute_values.__v': 0,
						'warranty_infor._id': 0,
						'warranty_infor.createdAt': 0,
						'warranty_infor.updatedAt': 0,
						'warranty_infor.__v': 0,
						'specifications._id': 0,
						'specifications.createdAt': 0,
						'specifications.updatedAt': 0,
						'specifications.__v': 0,
						'breadcrumbs.image': 0,
						'breadcrumbs.banners': 0,
						'breadcrumbs.parent_id': 0,
						'breadcrumbs.status': 0,
						'breadcrumbs.createdAt': 0,
						'breadcrumbs.updatedAt': 0,
						'breadcrumbs.__v': 0,
					},
				},
			]);

			res.status(200).json(result[0]);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [GET] /products/:page/:number
	/*
		page: Number,
		number: Number
	*/
	async findAllWithPagination(req, res, next) {
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
	/*
		categoryIds: [Number],
		take: Number,
		query: {
			page: Number,
			sort: String,
			...
		}
	*/
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

			let chips = [];
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
							attributeValue && chips.push({ key, value, display: attributeValue.display_value });
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

			// switch to dynamic by filtered product if have time
			const staticFilterRating = {
				_id: '_1',
				query_name: 'rating',
				display_name: 'Rating',
				collapsed: 5,
				multi_select: false,
				values: [
					{
						_id: '_1.1',
						display_value: '5 Stars',
						query_value: '5',
					},
					{
						_id: '_1.2',
						display_value: '4 Stars',
						query_value: '4',
					},
					{
						_id: '_1.3',
						display_value: '3 Stars',
						query_value: '3',
					},
				],
			};
			const staticFilterPrice = {
				_id: '_2',
				query_name: 'price',
				display_name: 'Price',
				collapsed: 5,
				multi_select: false,
				values: [
					{
						_id: '_2.1',
						display_value: 'Less than 400.000',
						query_value: '0,400000',
					},
					{
						_id: '_2.2',
						display_value: 'From 400.000 to 13.500.000',
						query_value: '400000,13500000',
					},
					{
						_id: '_2.3',
						display_value: 'From 13.500.000 to 32.500.000',
						query_value: '13500000,32500000',
					},
					{
						_id: '_2.4',
						display_value: 'More than 32.500.000',
						query_value: '32500000,10000000000',
					},
				],
			};

			res.json({
				products,
				totalProduct: count,
				filter: {
					rating: staticFilterRating,
					price: staticFilterPrice,
					attributes: filter[0],
				},
				chips,
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

	// [GET] /products/similar/:_id/:number
	/*
		_id: ObjectId as String
		number: Number,
	*/
	async findSimilarProducts(req, res, next) {
		try {
			let { _id, number } = req.params;
			_id = mongoose.Types.ObjectId(_id);
			number = parseInt(number);

			const product = await Product.findOne({
				_id,
				inventory_status: 'availabel',
			}).select('category');
			if (!product) {
				next({ status: 404, msg: 'Product not found!' });
				return;
			}

			const products = await Product.find({
				_id: { $ne: _id },
				category: product.category,
			})
				.select('name images discount discount_rate original_price price slug quantity_sold rating_average')
				.limit(number);
			res.status(200).json(products);
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
	async create(req, res, next) {
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
