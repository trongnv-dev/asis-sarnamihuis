import { select } from 'redux-saga/effects';

function* themeSaga() {
  const theme = yield select((state) => state.page.theme);
  localStorage.setItem('theme', theme);
}

export default themeSaga;
