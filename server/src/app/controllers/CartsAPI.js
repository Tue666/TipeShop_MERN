const mongoose = require('mongoose');

// model
const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartsAPI {
	// [GET] /carts
	async findByCustomerId(req, res, next) {
		try {
			let customer_id = req.account._id;
			customer_id = mongoose.Types.ObjectId(customer_id);

			const cart = await Cart.aggregate([
				{
					$match: { customer_id },
				},
				{
					$lookup: {
						from: 'products',
						localField: 'product_id',
						foreignField: '_id',
						as: 'product',
					},
				},
				{
					$set: {
						product: { $arrayElemAt: ['$product', 0] },
					},
				},
				// {
				// 	// flatten product to root each item
				// 	$replaceRoot: {
				// 		newRoot: {
				// 			$mergeObjects: [
				// 				{ cart_id: '$_id', cart_quantity: '$quantity', selected: '$selected' },
				// 				{ $arrayElemAt: ['$product', 0] },
				// 			],
				// 		},
				// 	},
				// },
				{
					$project: {
						_id: 1,
						quantity: 1,
						selected: 1,
						'product._id': 1,
						'product.name': 1,
						'product.images': 1,
						'product.quantity': 1,
						'product.original_price': 1,
						'product.price': 1,
						'product.limit': 1,
						'product.inventory_status': 1,
						'product.slug': 1,
					},
				},
			]);

			res.status(200).json(cart);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /carts
	/*
		product_id: ObjectId as String,
		quantity: Number,
	*/
	async insert(req, res, next) {
		try {
			let customer_id = req.account._id;
			customer_id = mongoose.Types.ObjectId(customer_id);
			let { product_id, quantity } = req.body;
			product_id = mongoose.Types.ObjectId(product_id);

			const originalProduct = await Product.findOne({ _id: product_id }).select(
				'_id name images quantity original_price price limit inventory_status slug'
			);
			if (!originalProduct) {
				next({ status: 400, msg: 'Product to be added could not be found!' });
				return;
			}

			let cartItem = await Cart.findOne({ customer_id, product_id });
			let newQuantity = cartItem?.quantity + quantity || quantity;

			if (newQuantity > originalProduct.quantity) {
				next({ status: 400, msg: `The remaining quantity of the product is ${originalProduct.quantity}` });
				return;
			}
			if (newQuantity > originalProduct.limit) {
				next({
					status: 400,
					msg: `Maximum purchase quantity for this product is ${originalProduct.limit}`,
				});
				return;
			}
			if (newQuantity < 1) {
				next({ status: 400, msg: `At least 1 product` });
				return;
			}

			// update the quantity if exists
			if (cartItem) {
				cartItem.quantity = newQuantity;
				await cartItem.save();
				res.status(200).json({
					state: 'UPDATED',
					msg: 'Update cart item quantity successfully!',
					cartItem: {
						_id: cartItem._id,
						quantity: cartItem.quantity,
					},
				});
				return;
			}

			// otherwise create a new one
			cartItem = new Cart({
				customer_id,
				product_id: originalProduct._id,
				quantity,
			});
			await cartItem.save();
			cartItem = cartItem.toObject();
			res.status(201).json({
				state: 'INSERTED',
				msg: 'Insert cart item successfully!',
				cartItem: {
					_id: cartItem._id,
					quantity: cartItem.quantity,
					selected: cartItem.selected,
					product: originalProduct,
				},
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [PATCH] /carts/quantity
	/*
		product_id: ObjectId as String,
		new_quantity: Number,
	*/
	async editQuantity(req, res, next) {
		try {
			let customer_id = req.account._id;
			customer_id = mongoose.Types.ObjectId(customer_id);
			let { product_id, new_quantity } = req.body;
			product_id = mongoose.Types.ObjectId(product_id);

			const originalProduct = await Product.findOne({ _id: product_id }).select('quantity limit');
			if (!originalProduct) {
				next({ status: 400, msg: 'Product to be added could not be found!' });
				return;
			}

			if (new_quantity > originalProduct.quantity) {
				next({ status: 400, msg: `The remaining quantity of the product is ${originalProduct.quantity}` });
				return;
			}
			if (new_quantity > originalProduct.limit) {
				next({
					status: 400,
					msg: `Maximum purchase quantity for this product is ${originalProduct.limit}`,
				});
				return;
			}
			if (new_quantity < 1) {
				next({ status: 400, msg: `At least 1 product` });
				return;
			}

			const cartItem = await Cart.findOneAndUpdate(
				{ customer_id, product_id },
				{
					quantity: new_quantity,
				},
				{
					new: true,
					fields: '_id quantity',
				}
			);

			res.status(200).json({
				msg: 'Update cart item quantity successfully!',
				cartItem,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [PATCH] /carts/selected
	/*
		type: String, [all, item]
		_id: ObjectId as String | Boolean,
	*/
	async editSelected(req, res, next) {
		try {
			let customer_id = req.account._id;
			customer_id = mongoose.Types.ObjectId(customer_id);
			let { type, _id } = req.body;
			_id = typeof _id === 'boolean' ? _id : mongoose.Types.ObjectId(_id);

			switch (type) {
				case 'item':
					// _id of the cart item to be changed
					await Cart.findByIdAndUpdate(_id, [
						{
							$set: {
								selected: { $not: '$selected' },
							},
						},
					]);
					break;
				case 'all':
					// _id will be the value to check select all or not
					await Cart.updateMany(
						{ customer_id },
						{
							selected: _id,
						}
					);
					break;
				default:
					break;
			}

			res.status(200).json({
				msg: 'Update select cart item successfully!',
				filter_selected: {
					type,
					_id,
				},
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [PUT] /carts | PUT replace for DELETE with body
	/*
		_id: ObjectId as String,
	*/
	async remove(req, res, next) {
		try {
			let customer_id = req.account._id;
			customer_id = mongoose.Types.ObjectId(customer_id);
			let { _id } = req.body;
			_id = !_id ? _id : mongoose.Types.ObjectId(_id);

			let result;
			// _id with null will remove all selected items
			if (!_id) {
				result = await Cart.deleteMany({ customer_id, selected: true });
			} else {
				// otherwise, remove item with _id only
				result = await Cart.deleteOne({ _id, customer_id });
			}

			res.status(200).json({
				_id,
				removed_count: result.deletedCount,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}
}

module.exports = new CartsAPI();
