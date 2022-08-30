const express = require('express');
const router = express.Router();

// controllers
const categoriesAPI = require('../app/controllers/CategoriesAPI');
// middlewares
const upload = require('../app/middlewares/upload');

router.post(
	'/',
	upload(false).fields([
		{ name: 'image', maxCount: 1 },
		{ name: 'banners', maxCount: 5 },
	]),
	categoriesAPI.create
);
router.get('/:_id', categoriesAPI.findById);
router.get('/', categoriesAPI.findAllRoot);

module.exports = router;
