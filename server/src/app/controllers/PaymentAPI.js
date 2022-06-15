const crypto = require('crypto');
const qs = require('qs');
const dayjs = require('dayjs');
const axios = require('axios').default;

// models
const Order = require('../models/Order');
// config
const { paymentConfig } = require('../../config/config');
// utils
const { sortObjectByAlphabet } = require('../../utils/formatObject');

class PaymentAPI {
	//#region Momo
	// [POST] /payment/momo/create
	/*
		_id: ObjectId as String,
		phone_number: String,
		amount: Number, [1000-20000000]
		redirectUrl: String,
	*/
	async momoCreate(req, res, next) {
		try {
			const { _id, phone_number, amount, redirectUrl } = req.body;
			const { domain, partnerCode, accessKey, secretKey } = paymentConfig.momo;

			let requestBody = {
				partnerCode,
				partnerName: 'Tipe Shop',
				requestId: `${_id}-${Date.now()}`,
				amount,
				orderId: `${_id}-${Date.now()}`,
				orderInfo: `Pay the bill for ${phone_number}. Amount ${amount} VND on ${dayjs(Date.now()).format(
					'YYYY-MM-DD HH:mm:ss'
				)}`,
				redirectUrl,
				ipnUrl: `https://${req.hostname}/api/payment/momo/ipn`,
				requestType: 'captureWallet',
				extraData: '',
				lang: 'vi',
			};

			const { partnerName, lang, ...other } = requestBody;
			const configSignature = sortObjectByAlphabet(
				{
					accessKey,
					...other,
				},
				false
			); // the second param determines whether to encode or not
			const rawSignature = qs.stringify(configSignature, { encode: false });
			const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
			requestBody['signature'] = signature;

			const url = `${domain}/v2/gateway/api/create`;
			const momoResponse = await axios.post(url, requestBody);
			const { payUrl } = momoResponse.data;

			res.status(200).json(payUrl);
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}

	// [POST] /payment/momo/ipn
	async momoIPNCallback(req, res, next) {
		try {
			const { signature, resultCode, orderId, message, orderInfo, ...other } = req.body;
			const { partnerCode, accessKey, secretKey } = paymentConfig.momo;

			const configHashSignature = sortObjectByAlphabet(
				{
					accessKey,
					partnerCode,
					resultCode,
					orderId,
					message,
					orderInfo,
					...other,
				},
				false
			); // the second param determines whether to encode or not
			const rawSignature = qs.stringify(configHashSignature, { encode: false });
			const hashedSignature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

			// confirm signed signature
			if (hashedSignature !== signature) {
				next({ status: 400, msg: 'Request failed!' });
				return;
			}

			const editBody = {
				'payment_method.message': message,
				'payment_method.description': orderInfo,
			};
			// payment successfully
			if (resultCode === 0) {
				editBody['tracking_infor.status'] = 'processing';
				editBody['tracking_infor.status_text'] = 'Pending processing';
				editBody['tracking_infor.time'] = Date.now();
			}
			const _id = orderId.split('-')[0];
			await Order.findOneAndUpdate(
				{
					_id,
					'tracking_infor.status': 'awaiting_payment',
				},
				editBody
			);

			res.status(200).end();
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}
	//#endregion

	//#region VNPAY
	// [POST] /payment/vnpay/create
	/*
		_id: ObjectId as String,
		phone_number: String,
		amount: Number,
		redirectUrl: String,
	*/
	vnpayCreate(req, res, next) {
		const { _id, phone_number, amount, redirectUrl } = req.body;
		const { url, terminalCode, secretKey } = paymentConfig.vnpay;

		const configSignature = sortObjectByAlphabet({
			vnp_Amount: amount * 100,
			vnp_Command: 'pay',
			vnp_CreateDate: dayjs(Date.now()).format('YYYYMMDDHHmmss'),
			vnp_CurrCode: 'VND',
			vnp_IpAddr:
				req.headers['x-forwarded-for'] ||
				req.connection.remoteAddress ||
				req.socket.remoteAddress ||
				req.connection.socket.remoteAddress,
			vnp_Locale: 'vn',
			vnp_OrderInfo: `Pay the bill for ${phone_number}. Amount ${amount} VND on ${dayjs(
				Date.now()
			).format('YYYY-MM-DD')}`,
			vnp_OrderType: 'billpayment',
			vnp_ReturnUrl: redirectUrl,
			vnp_TmnCode: terminalCode,
			vnp_TxnRef: `${_id}-${dayjs(Date.now()).format('HHmmss')}`,
			vnp_Version: '2.1.0',
		});

		const rawSignature = qs.stringify(configSignature, { encode: false });
		const signature = crypto.createHmac('sha512', secretKey).update(rawSignature).digest('hex');
		configSignature['vnp_SecureHash'] = signature;

		const payUrl = `${url}?${qs.stringify(configSignature, { encode: false })}`;

		res.status(200).json(payUrl);
	}

	// [GET] /payment/vnpay/ipn
	async vnpayIPNCallback(req, res, next) {
		try {
			const {
				vnp_SecureHashType,
				vnp_SecureHash,
				vnp_ResponseCode,
				vnp_TxnRef,
				vnp_OrderInfo,
				...other
			} = req.query;
			const { secretKey } = paymentConfig.vnpay;

			const configSignature = sortObjectByAlphabet({
				vnp_ResponseCode,
				vnp_TxnRef,
				vnp_OrderInfo,
				...other,
			});
			const rawSignature = qs.stringify(configSignature, { encode: false });
			const signature = crypto.createHmac('sha512', secretKey).update(rawSignature).digest('hex');

			// confirm signed signature
			if (vnp_SecureHash !== signature) {
				// return required VNPAY format
				res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
				return;
			}

			const editBody = {
				'payment_method.message': vnp_ResponseCode === '00' ? 'Giao dịch thành công' : 'Giao dịch thất bại',
				'payment_method.description': vnp_OrderInfo,
			};
			// payment successfully
			if (vnp_ResponseCode === '00') {
				editBody['tracking_infor.status'] = 'processing';
				editBody['tracking_infor.status_text'] = 'Pending processing';
				editBody['tracking_infor.time'] = Date.now();
			}
			const _id = vnp_TxnRef.split('-')[0];
			await Order.findByIdAndUpdate(_id, editBody);

			// return required VNPAY format
			res.status(200).json({ RspCode: '00', Message: 'success' });
		} catch (error) {
			console.error(error);
			next({ status: 500, msg: error.message });
		}
	}
	//#endregion
}

module.exports = new PaymentAPI();
