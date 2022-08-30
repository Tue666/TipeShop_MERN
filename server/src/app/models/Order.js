const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const Order = new Schema(
	{
		customer_id: { type: mongoose.Types.ObjectId, ref: 'Account', required: true },
		shipping_address: {
			_id: { type: mongoose.Types.ObjectId, required: true },
			country: { type: String, required: true },
			name: { type: String, required: true },
			phone_number: { type: String, required: true },
			company: { type: String },
			region: { type: String, required: true },
			district: { type: String, required: true },
			ward: { type: String, required: true },
			street: { type: String, required: true },
			delivery_address_type: { type: String, required: true },
		},
		payment_method: {
			method_text: { type: String, required: true },
			method_key: { type: String, required: true },
			message: { type: String, default: '' },
			description: { type: String, default: '' },
		},
		items: [
			{
				_id: { type: mongoose.Types.ObjectId, required: true },
				name: { type: String, required: true },
				images: [{ type: String, required: true }],
				original_price: { type: Number, required: true },
				price: { type: Number, required: true },
				limit: { type: Number, required: true },
				quantity: { type: Number, required: true },
				inventory_status: { type: String, required: true },
				slug: { type: String, required: true },
			},
		],
		price_summary: [
			{
				_id: false,
				name: { type: String, required: true },
				value: { type: Number, required: true },
			},
		],
		tracking_infor: {
			status: { type: String, default: 'processing' },
			status_text: { type: String, default: 'Pending processing' },
			time: { type: Date, default: Date.now },
		},
		note: { type: String, default: '' },
	},
	{
		timestamps: true,
	}
);

Order.plugin(mongooseDelete, {
	deletedAt: true,
	deletedBy: true,
	deletedByType: {
		name: { type: String },
	},
	overrideMethods: true,
});

module.exports = mongoose.model('Order', Order);
