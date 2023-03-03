import axiosClient from './axiosClient';
import apiConfig from 'lib/api/api';

const authApi = {
  login: (data) => {
    const url = `/auth/login`;
    return axiosClient.post(url, data);
  },

  update: (data) => {
    const url = `/auth/me`;
    return axiosClient.post(url, data);
  },
};


export default authApi;
