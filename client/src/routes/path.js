const path = (root, sublink) => {
	return `${root}${sublink}`;
};

const ROOT_MAIN = '/';
const ROOT_CUSTOMER = '/customer';
const ROOT_CHECKOUT = '/checkout';

export const PATH_MAIN = {
	home: ROOT_MAIN,
	cart: '/cart',
	news: '/news',
	invoiceLookup: '/invoice/lookup',
};

export const PATH_CUSTOMER = {
	profile: path(ROOT_CUSTOMER, '/profile'),
	addresses: path(ROOT_CUSTOMER, '/addresses'),
	createAddress: path(ROOT_CUSTOMER, '/addresses/create'),
	editAddress: path(ROOT_CUSTOMER, '/addresses/edit'),
	orders: path(ROOT_CUSTOMER, '/orders'),
	orderDetail: path(ROOT_CUSTOMER, '/orders/view'),
};

export const PATH_CHECKOUT = {
	shipping: path(ROOT_CHECKOUT, '/shipping'),
	payment: path(ROOT_CHECKOUT, '/payment'),
	result: path(ROOT_CHECKOUT, '/result'),
};
