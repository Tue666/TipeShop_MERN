import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// models
import type { Resources, Operation } from '../../models';
// redux
import { RootState } from '../store';

export interface AccessControlState {
  resources: Resources;
  operations: Operation[];
}

const initialState: AccessControlState = {
  resources: {},
  operations: [],
};

const slice = createSlice({
  name: 'accessControl',
  initialState,
  reducers: {
    initializeAccessControl: (state, action: PayloadAction<AccessControlState>) => {
      const { resources, operations } = action.payload;
      state.resources = resources;
      state.operations = operations;
    },
  },
});

const { reducer, actions } = slice;
export const { initializeAccessControl } = actions;
export const selectAccessControl = (state: RootState) => state.accessControl;
export default reducer;

export function* accessControlSaga() {
  console.log('accessControl saga');
}
