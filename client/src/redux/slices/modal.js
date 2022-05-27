import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isOpen: false,
	key: 'default',
};

const slice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		renderModal: (state, action) => {
			const { isOpen, key } = action.payload;
			state.isOpen = isOpen;
			state.key = key;
		},
	},
});

const { reducer, actions } = slice;
export const { renderModal } = actions;
export default reducer;
