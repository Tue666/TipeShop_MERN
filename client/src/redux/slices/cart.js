import { createSlice } from '@reduxjs/toolkit';

// apis
import cartApi from '../../apis/cartApi';
// utils
import enqueueSnackbar from '../../utils/snackbar';

const initialState = {
	items: [],
	totalItem: 0,
	paymentMethod: {
		key: '',
		label: '',
	},
};

const slice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		getCartSuccess(state, action) {
			const items = action.payload;
			state.items = items;
			state.totalItem = items.length;
		},
		addCartSuccess(state, action) {
			const cartItem = action.payload;
			state.items = [...state.items, cartItem];
			state.totalItem = state.items.length;
		},
		editQuantitySuccess(state, action) {
			const { _id, quantity } = action.payload;
			state.items = state.items.map((item) => (item._id === _id ? { ...item, quantity } : item));
		},
		editSelectedSuccess(state, action) {
			const { type, _id } = action.payload;
			switch (type) {
				case 'all':
					// _id will be the value to check select all or not
					state.items = state.items.map((item) => ({ ...item, selected: _id }));
					break;
				case 'item':
					// _id of the cart item to be changed
					state.items = state.items.map((item) =>
						item._id === _id ? { ...item, selected: !item.selected } : item
					);
					break;
				default:
					break;
			}
		},
		removeCartSuccess(state, action) {
			const _id = action.payload;
			// _id with null will remove all selected items
			if (!_id) state.items = state.items.filter((item) => !item.selected);
			else state.items = state.items.filter((item) => item._id !== _id);
			state.totalItem = state.items.length;
		},
		changePaymentMethod(state, action) {
			const { key, label } = action.payload;
			state.paymentMethod.key = key;
			state.paymentMethod.label = label;
		},
		removeSelected(state, action) {
			const orderedItems = action.payload;
			state.items = state.items.filter((item) => !orderedItems.includes(item.product._id));
			state.totalItem = state.items.length;
		},
		clearCart(state) {
			state.items = [];
			state.totalItem = 0;
		},
	},
});

const { reducer, actions } = slice;
export const { clearCart, changePaymentMethod, removeSelected } = actions;
export default reducer;

export const getCart = () => async (dispatch) => {
	try {
		const response = await cartApi.findByCustomerId();
		dispatch(slice.actions.getCartSuccess(response));
	} catch (error) {
		enqueueSnackbar(error.response.statusText, {
			variant: 'error',
			anchorOrigin: {
				vertical: 'bottom',
				horizontal: 'center',
			},
			preventDuplicate: true,
		});
	}
};

export const addCart = (params) => async (dispatch) => {
	try {
		const { product_id, quantity } = params;
		const response = await cartApi.insert({
			product_id,
			quantity,
		});
		const { state, msg, cartItem } = response;
		if (state === 'INSERTED') dispatch(slice.actions.addCartSuccess(cartItem));
		if (state === 'UPDATED') dispatch(slice.actions.editQuantitySuccess(cartItem));
		enqueueSnackbar(msg, {
			variant: 'success',
			anchorOrigin: {
				vertical: 'top',
				horizontal: 'right',
			},
		});
	} catch (error) {
		enqueueSnackbar(error.response.statusText, {
			anchorOrigin: {
				vertical: 'bottom',
				horizontal: 'center',
			},
			preventDuplicate: true,
		});
	}
};

export const editQuantity = (params) => async (dispatch) => {
	try {
		const { _id, product_id, new_quantity } = params;
		const response = await cartApi.editQuantity({
			_id,
			product_id,
			new_quantity,
		});
		const { cartItem } = response;
		dispatch(slice.actions.editQuantitySuccess(cartItem));
	} catch (error) {
		enqueueSnackbar(error.response.statusText, {
			anchorOrigin: {
				vertical: 'bottom',
				horizontal: 'center',
			},
			preventDuplicate: true,
		});
	}
};

export const editSelected = (params) => async (dispatch) => {
	try {
		const { type, _id } = params;
		const response = await cartApi.editSelected({
			type,
			_id,
		});
		const { filter_selected } = response;
		dispatch(slice.actions.editSelectedSuccess(filter_selected));
	} catch (error) {
		enqueueSnackbar(error.response.statusText, {
			anchorOrigin: {
				vertical: 'bottom',
				horizontal: 'center',
			},
			preventDuplicate: true,
		});
	}
};

export const removeCart = (params) => async (dispatch) => {
	try {
		const { _id } = params;
		const response = await cartApi.remove({
			_id,
		});
		const { removed_count } = response;
		if (removed_count > 0) dispatch(slice.actions.removeCartSuccess(response._id));
	} catch (error) {
		enqueueSnackbar(error.response.statusText, {
			anchorOrigin: {
				vertical: 'bottom',
				horizontal: 'center',
			},
			preventDuplicate: true,
		});
	}
};
