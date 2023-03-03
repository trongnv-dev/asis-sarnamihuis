import { combineReducers } from 'redux';
import sidemenuReducer from './sidemenuReducer';
import breadcrumbReducer from './breadcrumbReducer';
import firebaseReducer from './firebaseReducer';
import asideReducer from './asideReducer';
import pageReducer from './pageReducer';
import tokenReducer from './tokenReducer';
import language from './language';
import user  from './userReducer';

// Concatenate all reducers
const reducers = combineReducers({
  breadcrumb: breadcrumbReducer,
  sidemenu: sidemenuReducer,
  firebase: firebaseReducer,
  aside: asideReducer,
  page: pageReducer,
  token: tokenReducer,
  language: language,
  user: user,
});

export default reducers;
