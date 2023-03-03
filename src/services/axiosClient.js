import axios from 'axios';
import PAGE from 'config/page.config';
import { AuthStore } from 'lib/local_store/';
import moment from 'moment';
import Router from 'next/router';
import queryString from 'query-string';
import apiConfig from 'lib/api/api';
import { swal } from 'components/swal/instance';

const axiosClient = axios.create({
  baseURL: 'https://api-asis.amcon.nl/api',
  // baseURL: 'http://localhost/api',
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
  responseType: 'json',
});

let theLastTimeExpiredToken = null;

axiosClient.interceptors.request.use(
  function (config) {
    config.headers['Authorization'] = 'Bearer ' + apiConfig().headers.apikey;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    switch (error.response?.status) {
      case 401:
        if (theLastTimeExpiredToken) {
          const duration = moment.duration(moment().diff(theLastTimeExpiredToken));
          const seconds = duration.asSeconds();
          if (seconds < 1) {
            theLastTimeExpiredToken = moment();
          } else {
            theLastTimeExpiredToken = moment();
            swal.fire({ text: 'The login session is expired', icon: 'error' });
            await AuthStore.saveToken('');
            Router.push(PAGE.loginPagePath);
          }
        } else {
          theLastTimeExpiredToken = moment();
          swal.fire({ text: 'The login session is expired', icon: 'error' });
          await AuthStore.saveToken('');
          Router.push(PAGE.loginPagePath);
        }
        break;
      case 402:
        break;
      default:
        break;
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
