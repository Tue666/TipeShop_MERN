import { all } from 'redux-saga/effects';

// slices
import { operationSaga } from './slices/operation';

export default function* rootSaga() {
  yield all([operationSaga()]);
}
