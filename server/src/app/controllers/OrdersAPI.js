const mongoose = require('mongoose');

// models
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
// utils
const { fNumberWithSuffix } = require('../../utils/formatNumber');

class OrdersAPI {
	// [GET] /orders?page&limit&[status]
	async findByStatus(req, res, next) {
		try {
			let customer_id = req.account._id;
			customer_id = mongoose.Types.ObjectId(customer_id);
			let { page, limit, status } = req.query;
			page = parseInt(page);
			limit = parseInt(limit);

			const filter = {
				customer_id,
			};
			if (typeof status !== 'undefined') filter['tracking_infor.status'] = status;
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
	*/
	async insert(req, res, next) {
		try {
			let customer_id = req.account._id;
			customer_id = mongoose.Types.ObjectId(customer_id);
			let { items, ...other } = req.body;
			items = items.map((item) => ({ ...item, _id: mongoose.Types.ObjectId(item._id) }));

			if (items.length < 1) {
				next({ status: 500, msg: 'You have not selected any products to order yet!' });
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
				orderedItems,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}
}

module.exports = new OrdersAPI();
