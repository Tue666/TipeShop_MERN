const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

const Product = new Schema(
	{
		name: { type: String, required: true },
		images: { type: [String], required: true },
		quantity: { type: Number, required: true, min: 1, default: 1 },
		category: { type: Number, ref: 'Category', required: true },
		attribute_values: [{ type: Number, ref: 'AttributeValue' }],
		warranty_infor: [{ type: mongoose.Types.ObjectId, ref: 'Warranty' }],
		specifications: [{ type: mongoose.Types.ObjectId, ref: 'Specification' }],
		limit: { type: Number, min: 0, default: 0 }, // 0 is unlimited
		discount: { type: Number, min: 0, default: 0 },
		discount_rate: { type: Number, min: 0, max: 100, default: 0 },
		original_price: { type: Number, min: 0, default: 0 },
		price: { type: Number, min: 0, default: 0 },
		description: { type: String, default: '' },
		quantity_sold: {
			text: { type: String, default: '0 Sold' },
			value: { type: Number, min: 0, default: 0 },
		},
		favorite_count: { type: Number, min: 0, default: 0 },
		view_count: { type: Number, min: 0, default: 0 },
		meta_description: { type: String, default: '' },
		meta_keywords: { type: String, default: '' },
		meta_title: { type: String, default: '' },
		slug: { type: String, slug: 'name', unique: true },
		shippable: { type: Boolean, default: true },
		inventory_status: { type: String, default: 'availabel' },
	},
	{
		timestamps: true,
	}
);

// plugins
mongoose.plugin(slug);

module.exports = mongoose.model('Product', Product);
