const express = require('express');
const router = express.Router();

// controllers
const ordersAPI = require('../app/controllers/OrdersAPI');
// middlewares
const verifyToken = require('../app/middlewares/verifyToken');

router.post('/', verifyToken, ordersAPI.insert);
router.get('/', verifyToken, ordersAPI.findByStatus);

module.exports = router;
