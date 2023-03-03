import axiosClient from './axiosClient';
import queryString from 'query-string';

export const userApi = {
  getUserList: (params) => {
    let url = `/user-list/list`;
    if (params) {
      const query = queryString.stringify(params);
      url = `/user-list/list?${query}`;
    }
    return axiosClient.get(url);
  },

  editUserByIdUserGroup: (data) => {
    let url = `/user-list/update`;
    return axiosClient.post(url, data);
  },

  importDataLabel: (data) => {
    const url = `/user-list/label/import`;
    return axiosClient.post(url, data);
  },
};
