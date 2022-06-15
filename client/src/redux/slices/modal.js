import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isOpen: false,
	key: 'default',
	params: {
		beClosed: true,
	},
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
		disappearModal: (state) => {
			const { isOpen, key, params } = initialState;
			state.isOpen = isOpen;
			state.key = key;
			state.params = params;
		},
	},
});

const { reducer, actions } = slice;
export const { renderModal, disappearModal } = actions;
export default reducer;
