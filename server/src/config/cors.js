//
const { corsConfig } = require('./config');

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin || corsConfig.whiteList.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
};

module.exports = corsOptions;
