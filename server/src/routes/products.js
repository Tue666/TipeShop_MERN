const express = require('express');
const router = express.Router();

// controllers
const productsAPI = require('../app/controllers/ProductsAPI');
// middlewares
const upload = require('../app/middlewares/upload');

router.post('/', upload(false).array('images', 10), productsAPI.insert);
router.get('/ranking/:type/:number', productsAPI.findRankingProducts);

module.exports = router;
