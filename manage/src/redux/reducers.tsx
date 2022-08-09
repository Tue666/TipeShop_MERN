// slices
import accountReducer from './slices/account';
import operationReducer from './slices/operation';

const rootReducer = {
  operation: operationReducer,
  account: accountReducer,
};

export default rootReducer;
