import { createSlice } from '@reduxjs/toolkit';

// apis
import accountApi from '../../apis/accountApi';

const initialState = {
	isLoading: false,
	error: null,
	profile: null,
	addresses: [],
};

const slice = createSlice({
	name: 'account',
	initialState,
	reducers: {
		startLoading(state) {
			state.isLoading = true;
		},
		hasError(state, action) {
			state.isLoading = false;
			state.error = action.payload;
		},
		getProfileSuccess(state, action) {
			const { profile, addresses } = action.payload;
			state.isLoading = false;
			state.profile = profile;
			state.addresses = addresses;
		},
	},
});

const { reducer } = slice;
export default reducer;

export const getProfile = () => async (dispatch) => {
	dispatch(slice.actions.startLoading());
	try {
		const response = await accountApi.getProfile();
		dispatch(slice.actions.getProfileSuccess(response));
	} catch (error) {
		dispatch(slice.actions.hasError(error));
	}
};
