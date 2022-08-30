const mongoose = require('mongoose');

// models
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
// utils
const { fNumberWithSuffix } = require('../../utils/formatNumber');

class OrdersAPI {
	// [GET] /orders?page&limit&[status][search]
	async findByStatus(req, res, next) {
		try {
			let customer_id = req.account._id;
			customer_id = mongoose.Types.ObjectId(customer_id);
			let { page, limit, status, search } = req.query;
			page = parseInt(page);
			limit = parseInt(limit);

			const filter = {
				$and: [{ customer_id }],
			};
			if (typeof status !== 'undefined') filter.$and.push({ 'tracking_infor.status': status });
			if (typeof search !== 'undefined')
				filter.$or = [
					{
						$expr: { $eq: [{ $toString: '$_id' }, search] },
					},
					{ 'items.name': { $regex: search, $options: 'i' } },
				];
			const totalProduct = await Order.count(filter);
			const totalPage = Math.ceil(totalProduct / limit);
			const orders = await Order.find(filter)
				.sort({ updatedAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit);

			res.status(200).json({
				orders,
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

	// [GET] /orders/:_id
	async findById(req, res, next) {
		try {
			let customer_id = req.account._id;
			customer_id = mongoose.Types.ObjectId(customer_id);
			let { _id } = req.params;
			_id = mongoose.Types.ObjectId(_id);

			const order = await Order.findOne({
				_id,
				customer_id,
			});

			res.status(200).json(order);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /orders
	/*
		shipping_address: {
			_id: ObjectId as String,
			country: String,
			name: String,
			phone_number: String,
			company: String,
			region: String,
			district: String,
			ward: String,
			street: String,
			delivery_address_type: String,
		},
		payment_method: {
			method_text: String,
			method_key: String,
		},
		items: [
			{
				_id: ObjectId as String,
				name: String,
				images: [String],
				original_price: Number,
				price: Number,
				limit: Number,
				quantity: String,
				inventory_status: String,
				slug: String,
			}
		],
		price_summary: [
			{
				name: String,
				value: Number,
			},
		],
		[tracking_infor]: {
			status: String,
			status_text: String,
		}
	*/
	async create(req, res, next) {
		try {
			let customer_id = req.account._id;
			customer_id = mongoose.Types.ObjectId(customer_id);
			let { items, ...other } = req.body;
			items = items.map((item) => ({ ...item, _id: mongoose.Types.ObjectId(item._id) }));

			if (items.length < 1) {
				next({ status: 400, msg: 'You have not selected any products to order yet!' });
				return;
			}

			const order = new Order({
				customer_id,
				items,
				...other,
			});
			await order.save();

			// remove ordered items & update product quantity
			let orderedItems = [];
			await Promise.all(
				items.map(async (item) => {
					const { _id, quantity } = item;
					const product = await Product.findOne({
						_id,
					}).select('quantity quantity_sold');
					const newQuantity = product.quantity - quantity;
					const newQuantitySold = product.quantity_sold.value + quantity;
					if (newQuantity >= 0) {
						product.quantity = newQuantity;
						product.quantity_sold.value = newQuantitySold;
						product.quantity_sold.text = fNumberWithSuffix(newQuantitySold, 1) + ' Sold';
						await product.save();
						await Cart.deleteOne({
							customer_id,
							product_id: _id,
						});
						orderedItems.push(_id);
					}
				})
			);

			res.status(201).json({
				msg: 'Order is successful, please review the invoice while waiting for processing',
				_id: order._id,
				orderedItems,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [PATCH] /orders/status
	/*
		_id: ObjectId as String,
		new_status: String,
		[note]: String,
	*/
	async editStatus(req, res, next) {
		try {
			let customer_id = req.account._id;
			customer_id = mongoose.Types.ObjectId(customer_id);
			let { _id, new_status, note } = req.body;
			_id = mongoose.Types.ObjectId(_id);
			new_status = new_status.toLowerCase();

			let status_text = 'Pending processing';
			switch (new_status) {
				case 'processing':
					status_text = 'Pending processing';
					break;
				case 'transporting':
					status_text = 'Being transported';
					break;
				case 'delivered':
					status_text = 'Order delivered';
					break;
				case 'canceled':
					// canceled only when not yet transported
					const current = await Order.findOne({
						_id,
						customer_id,
					}).select('tracking_infor items');
					if (current.tracking_infor.status !== 'processing') {
						next({ status: 400, msg: 'Canceled only when not yet transported!' });
						return;
					}

					// return product quantity
					await Promise.all(
						current.items.map(async (item) => {
							const { _id, quantity } = item;
							const product = await Product.findOne({
								_id,
							}).select('quantity quantity_sold');
							const newQuantity = product.quantity + quantity;
							const newQuantitySold = product.quantity_sold.value - quantity;
							product.quantity = newQuantity;
							product.quantity_sold.value = newQuantitySold;
							product.quantity_sold.text = fNumberWithSuffix(newQuantitySold, 1) + ' Sold';
							await product.save();
						})
					);

					status_text = 'Order has been canceled';
					break;
				default:
					// refresh status
					new_status = 'processing';
					status_text = 'Pending processing';
					break;
			}

			const order = await Order.findOneAndUpdate(
				{
					_id,
					customer_id,
				},
				{
					'tracking_infor.status': new_status,
					'tracking_infor.status_text': status_text,
					'tracking_infor.time': Date.now(),
					note,
				},
				{
					new: true,
				}
			);

			res.status(200).json({
				msg: 'Edit status successfully!',
				order,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}
}

module.exports = new OrdersAPI();
