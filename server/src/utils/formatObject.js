const sortObjectByAlphabet = (object, encode = true) => {
	return Object.keys(object)
		.sort()
		.reduce((sorted, key) => {
			sorted[key] = encode ? encodeURIComponent(object[key]).replace(/%20/g, '+') : object[key];
			return sorted;
		}, {});
};

module.exports = {
	sortObjectByAlphabet,
};
