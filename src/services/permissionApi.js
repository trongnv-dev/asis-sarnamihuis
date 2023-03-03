import axiosClient from './axiosClient';
import apiConfig from 'lib/api/api';

const permisionApi = {
  quickEditLabel: (data) => {
    const url = `/permission/label`;
    return axiosClient.post(url, data);
  },

  getLabelList: (params) => {
    let url = `/permission/label/list`;
    if (params) url = `/permission/label/list?idUserGroup=${params.idUserGroup}&table=${params.table}`;
    return axiosClient.get(url);
  },

  upsertPermission: (data) => {
    const url = `/permission/upsert`;
    return axiosClient.post(url, data);
  },
  importDataLabel: (data) => {
    const url = `/permission/label/import`;
    return axiosClient.post(url, data);
  },
};

export default permisionApi;
