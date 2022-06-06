const express = require('express');
const router = express.Router();

// controllers
const ordersAPI = require('../app/controllers/OrdersAPI');
// middlewares
const verifyToken = require('../app/middlewares/verifyToken');

router.patch('/status', verifyToken, ordersAPI.editStatus);
router.post('/', verifyToken, ordersAPI.insert);
router.get('/:_id', verifyToken, ordersAPI.findById);
router.get('/', verifyToken, ordersAPI.findByStatus);

module.exports = router;
