import axiosClient from './axiosClient';
import apiConfig from 'lib/api/api';
import queryString from 'query-string';

const menuApi = {
  quickEditLabel: (params) => {
    const url = `/admin-menu/label`;
    return axiosClient.post(url, params);
  },

  getLabelList: (params) => {
    let url = `/admin-menu/label/list`;
    if (params) url = `/admin-menu/label/list?idUserGroup=${params.idUserGroup}&table=${params.table}`;
    return axiosClient.get(url);
  },

  deleteMenu: (idDelete) => {
    const url = `/admin-menu/delete`;
    return axiosClient.delete(url, {
      headers: apiConfig().headers,
      data: {
        id: idDelete,
      },
    });
  },

  addMenu: (params) => {
    const url = `/admin-menu/create`;
    return axiosClient.post(url, params);
  },

  editMenu: (params) => {
    const url = `/admin-menu/update`;
    return axiosClient.post(url, params);
  },

  detailMenu: (params) => {
    const url = `/admin-menu/detail?id=${params}`;
    return axiosClient.get(url);
  },

  getMenuList: (params) => {
    const query = queryString.stringify(params);
    const url = `/admin-menu/list?${query}`;
    return axiosClient.get(url);
  },
  importDataLabel: (data) => {
    const url = `/admin-menu/label/import`;
    return axiosClient.post(url, data);
  },
};

export default menuApi;
