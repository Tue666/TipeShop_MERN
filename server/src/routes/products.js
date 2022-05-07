const express = require('express');
const router = express.Router();

// controllers
const productsAPI = require('../app/controllers/ProductsAPI');
// middlewares
const upload = require('../app/middlewares/upload');

router.post('/filtered', productsAPI.findFilteredProducts);
router.post('/', upload(false).array('images', 10), productsAPI.insert);
router.get('/ranking/:type/:number', productsAPI.findRankingProducts);
router.get('/:page/:number', productsAPI.findAllWithPagination);

module.exports = router;
