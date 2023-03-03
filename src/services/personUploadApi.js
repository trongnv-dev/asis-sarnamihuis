import axiosClient from './axiosClient';
import apiConfig from 'lib/api/api';
import queryString from 'query-string';

const personUploadApi = {
  quickEditLabel: (params) => {
    const url = `/rel-person-uploads/label`;
    return axiosClient.post(url, params);
  },

  getLabelList: (params) => {
    let url = `/rel-person-uploads/label/list`;
    if (params) url = `/rel-person-uploads/label/list?idUserGroup=${params.idUserGroup}&table=${params.table}`;
    return axiosClient.get(url);
  },

  getPersonUploadList: (params) => {
    const query = queryString.stringify(params);
    const url = `/rel-person-uploads/list?${query}`;

    return axiosClient.get(url);
  },

  getPersonList: (params) => {
    const query = queryString.stringify(params);
    const url = `/rel-person-uploads/list-person?${query}`;

    return axiosClient.get(url);
  },

  switchActivePersonUpload: (id) => {
    const url = `/rel-person-uploads/set-active?id=${id}`;
    return axiosClient.get(url);
  },

  getItemPersonUpload: (id) => {
    const url = `/rel-person-uploads/detail?id=${id}`;
    return axiosClient.get(url);
  },

  deleteItemPersonUpload: (id) => {
    const url = `/rel-person-uploads/delete?id=${id}`;
    return axiosClient.delete(url);
  },

  editItemPersonUpload: (data) => {
    const url = `/rel-person-uploads/update`;
    return axiosClient.post(url, data);
  },

  createItemPersonUpload: (data) => {
    const url = `/rel-person-uploads/create`;
    return axiosClient.post(url, data);
  },

  getPersonUploadLabel: () => {
    const url = `/rel-person-uploads/label/list`;
    return axiosClient.get(url);
  },

  getItemPersonUploadLabel: (params) => {
    const url = `/rel-person-uploads/label/${params.id}`;
    const apiConfigcus = {
      headers: apiConfig().headers,
      responseType: apiConfig().responseType,
      params: {
        table: params.tableName,
      },
    };
    return axiosClient.get(url, apiConfigcus);
  },

  editPersonUploadLabel: (data) => {
    const url = `/rel-person-uploads/label`;
    return axiosClient.post(url, data);
  },

  importDataLabel: (data) => {
    const url = `/rel-person-uploads/label/import`;
    return axiosClient.post(url, data);
  },
};

export default personUploadApi;
