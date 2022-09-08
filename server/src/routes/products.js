const express = require('express');
const router = express.Router();

// controllers
const productsAPI = require('../app/controllers/ProductsAPI');
// middlewares
const upload = require('../app/middlewares/upload');

router.post('/filtered', productsAPI.findFilteredProducts);
router.post('/', upload(false).array('images', 10), productsAPI.create);
router.get('/similar/:_id/:number', productsAPI.findSimilarProducts);
router.get('/ranking/:type/:number', productsAPI.findRankingProducts);
router.get('/:page/:number', productsAPI.findAllWithPagination);
router.get('/:_id', productsAPI.findById);
router.get('/', productsAPI.findAll);

module.exports = router;
