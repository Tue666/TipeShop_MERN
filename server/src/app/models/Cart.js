const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cart = new Schema(
	{
		customer_id: { type: mongoose.Types.ObjectId, ref: 'Account', required: true },
		product_id: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
		quantity: { type: Number, required: true },
		selected: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Cart', Cart);
