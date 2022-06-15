const express = require('express');
const router = express.Router();

// controllers
const paymentAPI = require('../app/controllers/PaymentAPI');
// middlewares
const verifyToken = require('../app/middlewares/verifyToken');

router.post('/momo/ipn', paymentAPI.momoIPNCallback);
router.post('/momo/create', paymentAPI.momoCreate);
router.get('/vnpay/ipn', paymentAPI.vnpayIPNCallback);
router.post('/vnpay/create', paymentAPI.vnpayCreate);

module.exports = router;
