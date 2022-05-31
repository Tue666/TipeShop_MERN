const express = require('express');
const router = express.Router();

// controllers
const locationsAPI = require('../app/controllers/LocationsAPI');

router.post('/region', locationsAPI.insertRegion);
router.post('/district/:region_id', locationsAPI.insertDistrict);
router.post('/ward/:district_id', locationsAPI.insertWard);
router.get('/regions/:country', locationsAPI.findRegionsByCountry);
router.get('/districts/:region_id', locationsAPI.findDistrictsByRegionId);
router.get('/wards/:district_id', locationsAPI.findWardsByDistrictId);

module.exports = router;
