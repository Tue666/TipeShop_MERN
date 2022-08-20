import { all } from 'redux-saga/effects';

// slices
import { accountSaga } from './slices/account';
import { accessControlSaga } from './slices/accessControl';

export default function* rootSaga() {
  yield all([accountSaga(), accessControlSaga()]);
}
