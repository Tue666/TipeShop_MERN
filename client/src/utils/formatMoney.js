export const toVND = (number) => {
	return number.toLocaleString('vi', { style: 'currency', currency: 'VND' });
};
