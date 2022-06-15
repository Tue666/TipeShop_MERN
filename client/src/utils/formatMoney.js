import axios from 'axios';

// config
import { apiConfig } from '../config';

export const toVND = (number) => {
	return number.toLocaleString('vi', { style: 'currency', currency: 'VND' });
};

export const currencyConverter = async (from, to) => {
	const url = `https://free.currconv.com/api/v7/convert?q=${from}_${to}&apiKey=${apiConfig.currency_converter_api_key}`;
	const response = await axios.get(url);
	const converted = response.data;
	const { results } = converted;
	return results[`${from}_${to}`].val.toFixed(8);
};
