module.exports = (err, req, res, next) => {
	const status = err?.status || 500;
	const msg = err?.msg || 'Something went wrong!';
	res.statusMessage = msg;
	res.status(status).end();
};
