const mongoose = require('mongoose');

// config
const { dbConfig } = require('./config');

const connect = async () => {
	const { environment, compassUri, atlasUri } = dbConfig;
	try {
		const uri = environment === 'dev' ? compassUri : atlasUri;
		await mongoose.connect(uri, () => {
			console.log('DB connection successful');
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = { connect };
