import axiosClient from './axiosClient';
import apiConfig from 'lib/api/api';
import queryString from 'query-string';

const personApi = {
  quickEditLabel: (params) => {
    const url = `/rel-persons/label`;
    return axiosClient.post(url, params);
  },

  getLabelList: (params) => {
    let url = `/rel-persons/label/list`;
    if (params) url = `/rel-persons/label/list?idUserGroup=${params.idUserGroup}&table=${params.table}`;
    return axiosClient.get(url);
  },

  getPersonList: (params) => {
    const query = queryString.stringify(params);
    const url = `/rel-persons/list?${query}`;

    return axiosClient.get(url);
  },

  switchActivePerson: (id) => {
    const url = `/rel-persons/set-active?id=${id}`;
    return axiosClient.get(url);
  },

  getItemPerson: (id) => {
    const url = `/rel-persons/detail?id=${id}`;
    return axiosClient.get(url);
  },

  deleteItemPerson: (id) => {
    const url = `/rel-persons/delete?id=${id}`;
    return axiosClient.delete(url);
  },

  editItemPerson: (data) => {
    const url = `/rel-persons/update`;
    return axiosClient.post(url, data);
  },

  createItemPerson: (data) => {
    const url = `/rel-persons/create`;
    return axiosClient.post(url, data);
  },

  getPersonLabel: () => {
    const url = `/rel-persons/label/list`;
    return axiosClient.get(url);
  },

  getItemPersonLabel: (params) => {
    const url = `/rel-persons/label/${params.id}`;
    const apiConfigcus = {
      headers: apiConfig().headers,
      responseType: apiConfig().responseType,
      params: {
        table: params.tableName,
      },
    };
    return axiosClient.get(url, apiConfigcus);
  },

  editPersonLabel: (data) => {
    const url = `/rel-persons/label`;
    return axiosClient.post(url, data);
  },

  importDataLabel: (data) => {
    const url = `/rel-persons/label/import`;
    return axiosClient.post(url, data);
  },
};

export default personApi;
