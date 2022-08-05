import { createSlice } from '@reduxjs/toolkit';

// models
import { Resource } from '../../models';
// redux
import { RootState } from '../store';

export interface OperationState {
  resources: Resource[];
}

const initialState: OperationState = {
  resources: [],
};

const slice = createSlice({
  name: 'operation',
  initialState,
  reducers: {},
});

const { reducer } = slice;
export const selectOperation = (state: RootState) => state.operation;
export default reducer;

export function* operationSaga() {
  console.log('operation saga');
}
