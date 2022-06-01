import { createSlice } from '@reduxjs/toolkit';

// apis
import accountApi from '../../apis/accountApi';
// utils
import enqueueSnackbar from '../../utils/snackbar';

const initialState = {
	profile: null,
	addresses: [],
};

const slice = createSlice({
	name: 'account',
	initialState,
	reducers: {
		getProfileSuccess(state, action) {
			const { profile, addresses } = action.payload;
			state.profile = profile;
			state.addresses = addresses;
		},
		insertAddressSuccess(state, action) {
			const address = action.payload;
			const { is_default } = address;
			// edit anything else to non-default if address have been added is default
			if (is_default && state.addresses.length > 0) {
				state.addresses = state.addresses.map((address) => ({ ...address, is_default: false }));
			}
			state.addresses = [address, ...state.addresses];
		},
		editAddressSuccess(state, action) {
			const address = action.payload;
			const { _id, ...other } = address;
			state.addresses = state.addresses.map((address) =>
				address._id === _id
					? { ...address, ...other }
					: { ...address, is_default: other.is_default ? false : address.is_default }
			);
		},
		removeAddressSuccess(state, action) {
			const _id = action.payload;
			state.addresses = state.addresses.filter((address) => address._id !== _id);
		},
		clearAccount(state) {
			state.profile = null;
			state.addresses = [];
		},
	},
});

const { reducer, actions } = slice;
export const { clearAccount } = actions;
export default reducer;

export const getProfile = () => async (dispatch) => {
	try {
		const response = await accountApi.getProfile();
		dispatch(slice.actions.getProfileSuccess(response));
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

export const insertAddress = (params) => async (dispatch) => {
	try {
		const response = await accountApi.insertAddress(params);
		const { msg, address } = response;
		dispatch(slice.actions.insertAddressSuccess(address));
		enqueueSnackbar(msg, {
			variant: 'success',
			anchorOrigin: {
				vertical: 'top',
				horizontal: 'right',
			},
		});
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

export const editAddress = (params) => async (dispatch) => {
	try {
		const response = await accountApi.editAddress(params);
		const { msg, address } = response;
		dispatch(slice.actions.editAddressSuccess(address));
		enqueueSnackbar(msg, {
			variant: 'success',
			anchorOrigin: {
				vertical: 'top',
				horizontal: 'right',
			},
		});
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

export const removeAddress = (params) => async (dispatch) => {
	try {
		const response = await accountApi.removeAddress(params);
		const { msg, _id } = response;
		dispatch(slice.actions.removeAddressSuccess(_id));
		enqueueSnackbar(msg, {
			variant: 'success',
			anchorOrigin: {
				vertical: 'top',
				horizontal: 'right',
			},
		});
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
