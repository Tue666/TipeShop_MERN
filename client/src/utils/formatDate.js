export const fDate = (stringDate) => {
	const location = 'en-US';
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	const date = new Date(stringDate);
	const time = date.toLocaleTimeString(location);
	const dateFormated = date.toLocaleDateString(location, options);
	return `${time}, ${dateFormated}`;
};
