const mongoose = require('mongoose');

// config
const { dbConfig } = require('./config');

const connect = async () => {
	const { mongoDbUri } = dbConfig;
	try {
		await mongoose.connect(mongoDbUri, () => {
			console.log('DB connection successful');
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = { connect };
