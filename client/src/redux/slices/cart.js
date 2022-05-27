import { createSlice } from '@reduxjs/toolkit';

// apis
import cartApi from '../../apis/cartApi';
// utils
import enqueueSnackbar from '../../utils/snackbar';

const initialState = {
	items: null,
	totalItem: 0,
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
	},
});

const { reducer } = slice;
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
		const { product, quantity } = params;
		const response = await cartApi.insert({
			product,
			quantity,
		});
		const { state, msg } = response;
		if (state === 'INSERTED') {
			console.log('inserted');
		}
		if (state === 'UPDATED') {
			console.log('updated');
		}
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
