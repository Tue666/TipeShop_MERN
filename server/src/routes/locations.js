const express = require('express');
const router = express.Router();

// controllers
const locationsAPI = require('../app/controllers/LocationsAPI');

router.post('/region', locationsAPI.insertRegion);
router.post('/district/:region_id', locationsAPI.insertDistrict);
router.post('/ward/:district_id', locationsAPI.insertWard);

module.exports = router;
