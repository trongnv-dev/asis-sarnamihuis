import { swal } from 'components/swal/instance';
import { call, fork, put, spawn } from 'redux-saga/effects';
import { languageApi } from 'services';
import { setCurrentLanguage, setCurrentLanguageList } from 'store/actions';

function* fetchCurrentLanguage() {
  const { data } = yield call(languageApi.getCurrentLanguage);
  yield put(setCurrentLanguage(data));
}

function* fetchCurrentLanguageList() {
  const { data } = yield call(languageApi.getCurrentLanguageList);
  let array = [];
  if (data.listLanguageActive || data.listLanguageActive.length > 0) {
    array = Object.keys(data.listLanguageActive).map(function (key) {
      return data.listLanguageActive[key];
    });
  }
  yield put(setCurrentLanguageList({ listLanguageActive: array }));
}

function* fetchAll() {
  const task1 = yield spawn(fetchCurrentLanguage);
  const task2 = yield spawn(fetchCurrentLanguageList);
}

function* getLanguage() {
  try {
    yield call(fetchAll);
  } catch (e) {
    console.log(e);
    swal.fire({ text: error.message, icon: 'error' });
  }
}

export default getLanguage;
