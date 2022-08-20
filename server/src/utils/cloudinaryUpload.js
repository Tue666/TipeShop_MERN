const cloudinary = require('cloudinary').v2;

// config
const { cloudinaryConfig } = require('../config/config');

cloudinary.config({
	cloud_name: cloudinaryConfig.cloud_name,
	api_key: cloudinaryConfig.api_key,
	api_secret: cloudinaryConfig.api_secret,
});

module.exports = (file, folder) =>
	cloudinary.uploader.upload(file, {
		folder,
	});
