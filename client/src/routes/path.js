const path = (root, sublink) => {
	return `${root}${sublink}`;
};

const ROOT_MAIN = '/';
const ROOT_CUSTOMER = '/customer';

export const PATH_MAIN = {
	home: ROOT_MAIN,
	cart: '/cart',
};

export const PATH_CUSTOMER = {
	profile: path(ROOT_CUSTOMER, '/profile'),
	addresses: path(ROOT_CUSTOMER, '/addresses'),
	addressForm: path(ROOT_CUSTOMER, '/addresses/create'),
};
