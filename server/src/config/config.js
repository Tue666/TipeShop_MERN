const dbConfig = {
	mongoDbUri: process.env.MONGODB_URI,
};

const corsConfig = {
	whiteList: process.env.CORS_WHITELIST.split(','),
};

const cloudinaryConfig = {
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
};

const paymentConfig = {
	momo: {
		domain: process.env.MOMO_DOMAIN,
		partnerCode: process.env.MOMO_PARTNER_CODE,
		accessKey: process.env.MOMO_ACCESS_KEY,
		secretKey: process.env.MOMO_SECRET_KEY,
	},
	vnpay: {
		url: process.env.VNPAY_URL,
		terminalCode: process.env.VNPAY_TERMINAL_CODE,
		secretKey: process.env.VNPAY_SECRET_KEY,
	},
};

module.exports = { dbConfig, corsConfig, cloudinaryConfig, paymentConfig };
