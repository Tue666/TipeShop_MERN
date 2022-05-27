const express = require('express');
const router = express.Router();

// controllers
const cartsAPI = require('../app/controllers/CartsAPI');
// middlewares
const verifyToken = require('../app/middlewares/verifyToken');

router.patch('/quantity', verifyToken, cartsAPI.editQuantity);
router.post('/', verifyToken, cartsAPI.insert);
router.get('/', verifyToken, cartsAPI.findByCustomerId);

module.exports = router;
