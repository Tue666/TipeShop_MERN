import { configureStore } from '@reduxjs/toolkit';

// reducers
import rootReducer from './reducers';

const store = configureStore({
	reducer: rootReducer,
});

export default store;
