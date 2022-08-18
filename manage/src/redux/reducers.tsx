// slices
import accountReducer from './slices/account';
import accessControlReducer from './slices/accessControl';

const rootReducer = {
  accessControl: accessControlReducer,
  account: accountReducer,
};

export default rootReducer;
