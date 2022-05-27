// slices
import modalReducer from './slices/modal';
import accountReducer from './slices/account';
import cartReducer from './slices/cart';

const rootReducer = {
	modal: modalReducer,
	account: accountReducer,
	cart: cartReducer,
};

export default rootReducer;
