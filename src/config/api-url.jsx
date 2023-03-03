/*
 * List API link
 */

// let baseUrl = 'http://localhost/api';
let baseUrl = 'https://api-asis.amcon.nl/api';

const URL = {
  LOGIN: baseUrl + '/auth/login',
  LANGUAGE_LIST: baseUrl + '/languages/list',
  LANGUAGE_LABEL: baseUrl + '/languages/label/list',
  ACTIVE_LANGUAGE: baseUrl + '/languages/update-status',
  EDIT_LANGUAGE: baseUrl + '/languages/edit',
  EDIT_LABEL: baseUrl + '/common/label/edit',
  GENDER_LIST: baseUrl + '/genders/list',
  GENDER_ACTIVE: baseUrl + '/genders/set-active',
  GENDER_DETAIL: baseUrl + '/genders/detail',
  GENDER_EDIT: baseUrl + '/genders/update',
  GENDER_DELETE: baseUrl + '/genders/delete',
  GENDER_CREATE: baseUrl + '/genders/create',
  GENDER_LABEL: baseUrl + '/genders/label/list',
  EDIT_GENDER_LABEL: baseUrl + '/common/label/edit',
  BASE_URL: 'https://api-asis.amcon.nl',
  // BASE_URL: 'http://localhost',
  PERSON_LABEL: baseUrl + '/rel_persons/label/list',
};

export default URL;
