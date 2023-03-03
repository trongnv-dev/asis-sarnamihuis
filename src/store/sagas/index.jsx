import { takeLatest, takeEvery, all } from 'redux-saga/effects';
import TYPES from 'store/types';
import themeSaga from './themeSaga';
import getLanguage from './language';

function* rootSaga() {
  yield all([yield takeEvery(TYPES.PAGE_CHANGE_THEME, themeSaga), yield takeEvery(TYPES.LANGUAGE, getLanguage)]);
}
export default rootSaga;
