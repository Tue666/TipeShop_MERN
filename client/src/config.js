export const socialConfig = {
	facebook: {
		appId: process.env.REACT_APP_FACEBOOK_APP_ID,
	},
	google: {
		clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
	},
};

export const paymentConfig = {
	paypal: {
		'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID,
	},
};

export const apiConfig = {
	environment: process.env.REACT_APP_ENV,
	api_url_dev: process.env.REACT_APP_API_URL_DEV,
	api_url_productiton: process.env.REACT_APP_API_URL_PRODUCTION,
	image_url: process.env.REACT_APP_IMAGE_URL,
	currency_converter_api_key: process.env.REACT_APP_CURRENCY_CONVERTER_API_KEY,
};

export const appConfig = {
	public_image_url: '/images',
	public_icon_url: '/icons',
};
