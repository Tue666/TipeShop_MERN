const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

// models
const { autoIncrementModelID } = require('./Counter');

const Category = new Schema(
	{
		_id: { type: Number },
		name: { type: String, required: true },
		image: { type: String, required: true },
		banners: { type: [String], default: [] },
		parent_id: { type: Number, default: null },
		meta_description: { type: String, default: '' },
		meta_keywords: { type: String, default: '' },
		meta_title: { type: String, default: '' },
		slug: { type: String, slug: 'name', unique: true },
		status: { type: String, default: 'active' },
	},
	{
		_id: false,
		timestamps: true,
	}
);

// plugins
mongoose.plugin(slug);

Category.pre('save', function (next) {
	if (!this.isNew) {
		next();
		return;
	}
	autoIncrementModelID('category', this, next);
});

Category.plugin(mongooseDelete, {
	deletedAt: true,
	deletedBy: true,
	deletedByType: {
		name: { type: String },
	},
	overrideMethods: true,
});

module.exports = mongoose.model('Category', Category);
