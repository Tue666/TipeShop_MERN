const dbConfig = {
	environment: process.env.NODE_ENV,
	compassUri: process.env.COMPASS_URI,
	atlasUri: process.env.ATLAS_URI,
};

const cloudinaryConfig = {
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
};

module.exports = { dbConfig, cloudinaryConfig };
