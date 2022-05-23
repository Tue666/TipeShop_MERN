const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
	const accessToken = jwt.sign(payload, process.env.SECRET_SIGNATURE, {
		expiresIn: 60 * 60, // 1 hours
	});
	const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_SIGNATURE, {
		expiresIn: 60 * 60 * 48, // 2 days
	});
	return { accessToken, refreshToken };
};

const verify = (token, signature) => {
	jwt.verify(token, signature);
};

module.exports = {
	generateToken,
	verify,
};
