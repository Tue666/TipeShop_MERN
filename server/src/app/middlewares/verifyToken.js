const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const authorizationHeader = req.headers['authorization'];
	const accessToken = authorizationHeader && authorizationHeader.split(' ')[1];
	if (!accessToken) return res.sendStatus(401);
	try {
		const account = jwt.verify(accessToken, process.env.SECRET_SIGNATURE);
		req.account = account;
		next();
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.sendStatus(401);
		}
		res.sendStatus(403);
	}
};

module.exports = verifyToken;
