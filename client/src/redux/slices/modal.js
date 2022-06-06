import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isOpen: false,
	key: 'default',
	params: null,
};

const slice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		renderModal: (state, action) => {
			const { isOpen, key, params } = action.payload;
			state.isOpen = isOpen;
			state.key = key;
			state.params = params;
		},
	},
});

const { reducer, actions } = slice;
export const { renderModal } = actions;
export default reducer;
