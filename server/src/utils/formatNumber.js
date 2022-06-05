const ranges = [
	{ value: 1e18, suffix: 'E' },
	{ value: 1e15, suffix: 'P' },
	{ value: 1e12, suffix: 'T' },
	{ value: 1e9, suffix: 'G' },
	{ value: 1e6, suffix: 'M' },
	{ value: 1e3, suffix: 'K' },
];

const fNumberWithSuffix = (number, digits) => {
	for (let i = 0; i < ranges.length; i++) {
		const { value, suffix } = ranges[i];
		if (number > value) return (number / value).toFixed(digits).toString() + suffix;
	}
	return number.toString();
};

module.exports = {
	fNumberWithSuffix,
};
