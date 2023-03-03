import axiosClient from './axiosClient';
import apiConfig from 'lib/api/api';
import queryString from 'query-string';

const userGroupApi = {
  quickEditLabel: (params) => {
    const url = `/user-group/label`;
    return axiosClient.post(url, params);
  },

  getLabelList: (params) => {
    let url = `/user-group/label/list`;
    if (params) url = `/user-group/label/list?idUserGroup=${params.idUserGroup}&table=${params.table}`;
    return axiosClient.get(url);
  },

  getUserGroupList: (params) => {
    const query = queryString.stringify(params);
    const url = `/user-group/list?${query}`;
    return axiosClient.get(url);
  },

  switchActiveUserGroup: (id) => {
    const url = `/user-group/set-active`;
    return axiosClient.post(url, { id: id });
  },

  getItemUserGroup: (id) => {
    const url = `/user-group/detail?id=${id}`;
    return axiosClient.get(url);
  },

  deleteItemUserGroup: (id) => {
    const url = `/user-group/delete?id=${id}`;
    return axiosClient.get(url);
  },

  editItemUserGroup: (data) => {
    const url = `/user-group/update`;
    return axiosClient.post(url, data);
  },

  createItemUserGroup: (data) => {
    const url = `/user-group/create`;
    return axiosClient.post(url, data);
  },

  getUserGroupLabel: () => {
    const url = `/user-group/label/list`;
    return axiosClient.get(url);
  },

  getItemUserGroupLabel: (params) => {
    const url = `/user-group/label/${params.id}`;
    const apiConfigcus = {
      headers: apiConfig().headers,
      responseType: apiConfig().responseType,
      params: {
        table: params.tableName,
      },
    };
    return axiosClient.get(url, apiConfigcus);
  },

  editUserGroupLabel: (data) => {
    const url = `/user-group/label`;
    return axiosClient.post(url, data);
  },

  importDataLabel: (data) => {
    const url = `/user-group/label/import`;
    return axiosClient.post(url, data);
  },
};

export default userGroupApi;
