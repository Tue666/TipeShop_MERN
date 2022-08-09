import { all } from 'redux-saga/effects';

// slices
import { accountSaga } from './slices/account';

export default function* rootSaga() {
  yield all([accountSaga()]);
}
