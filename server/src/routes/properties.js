const express = require('express');
const router = express.Router();

// controllers
const propertiesAPI = require('../app/controllers/PropertiesAPI');

router.post('/attribute/value', propertiesAPI.insertAttributeValue);
router.post('/attribute', propertiesAPI.insertAttribute);
router.post('/warranty', propertiesAPI.insertWarranty);
router.post('/specification', propertiesAPI.insertSpecification);

module.exports = router;
