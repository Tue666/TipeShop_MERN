// models
const Attribute = require('../models/Attribute');
const AttributeValue = require('../models/AttributeValue');
const Warranty = require('../models/Warranty');
const Specification = require('../models/Specification');

class PropertiesAPI {
	//#region attribute
	// [POST] /properties/attribute
	/*
		query_name: String,
		display_name: String,
	*/
	async insertAttribute(req, res) {
		try {
			const attribute = new Attribute(req.body);
			await attribute.save();
			res.status(201).json({
				msg: 'Insert attribute successfully!',
				attribute,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /properties/attribute/value
	/*
		attribute_query_name: String,
		display_value: String,
	*/
	async insertAttributeValue(req, res) {
		try {
			const attributeValue = new AttributeValue(req.body);
			await attributeValue.save();
			res.status(200).json({
				msg: 'Insert attribute value successfully!',
				attribute_value: attributeValue,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}
	//#endregion

	//#region warranty
	// [POST] /properties/warranty
	/*
		name: String,
		value: String,
	*/
	async insertWarranty(req, res) {
		try {
			const warranty = new Warranty(req.body);
			await warranty.save();
			res.status(201).json({
				msg: 'Insert warranty successfully!',
				warranty,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}
	//#endregion

	//#region specification
	// [POST] /properties/specification
	/*
		name: String,
		value: String,
	*/
	async insertSpecification(req, res) {
		try {
			const specification = new Specification(req.body);
			await specification.save();
			res.status(201).json({
				msg: 'Insert specification successfully!',
				specification,
			});
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}
	//#endregion
}

module.exports = new PropertiesAPI();
