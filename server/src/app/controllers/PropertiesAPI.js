// models
const { generateSeqById } = require('../models/Counter');
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
	async insertAttribute(req, res, next) {
		try {
			const { query_name, ...body } = req.body;

			// for sure attribute not existed
			const attr = await Attribute.findOne({
				query_name,
			});
			if (attr) {
				next({ status: 400, msg: 'Attribute existed!' });
				return;
			}

			const attribute = new Attribute({
				...body,
				query_name,
			});
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
	async insertAttributeValue(req, res, next) {
		try {
			const { attribute_query_name, value_type, value, ...body } = req.body;
			let query_value = '';

			// check if attribute existed & contains value_type
			const attribute = await Attribute.findOne({
				query_name: attribute_query_name,
			});
			if (!attribute) {
				next({ status: 400, msg: 'Attribute not found!' });
				return;
			}
			if (attribute.value_type !== value_type) {
				const { display_name } = attribute;
				next({
					status: 400,
					msg: `Type of ${display_name} is ${attribute.value_type}. Received as ${value_type}`,
				});
				return;
			}

			switch (value_type) {
				case 'Letter':
					{
						if (!/.*[a-z_]+.*$/i.test(value)) {
							next({ status: 400, msg: 'Letter type value must be at least one letter!' });
							return;
						}
						query_value = value;
					}
					break;
				case 'Range':
					{
						const { from, to } = value;
						if (!from || !to) {
							next({ status: 400, msg: 'Range type must have FROM VALUE & TO VALUE!' });
							return;
						}
						query_value = `${from},${to}`;
					}
					break;
				default:
					// default will auto generate unique value
					const uniqueValue = await generateSeqById(attribute_query_name);
					query_value = uniqueValue.toString();
					break;
			}

			// check if attribute value not existed
			const attrValue = await AttributeValue.findOne({
				attribute_query_name,
				query_value,
			});
			if (attrValue) {
				next({ status: 400, msg: 'Value of this attribute existed!' });
				return;
			}

			const attributeValue = new AttributeValue({
				...body,
				attribute_query_name,
				query_value,
			});
			await attributeValue.save();

			res.status(201).json({
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
	async insertWarranty(req, res, next) {
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
	async insertSpecification(req, res, next) {
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
