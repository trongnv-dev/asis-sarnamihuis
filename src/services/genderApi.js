import axiosClient from './axiosClient';
import apiConfig from 'lib/api/api';
import queryString from 'query-string';

const genderApi = {
  quickEditLabel: (params) => {
    const url = `/genders/label`;
    return axiosClient.post(url, params);
  },

  getLabelList: (params) => {
    let url = `/genders/label/list`;
    if (params) url = `/genders/label/list?idUserGroup=${params.idUserGroup}&table=${params.table}`;

    return axiosClient.get(url);
  },
  getGenderList: (params) => {
    const query = queryString.stringify(params);
    const url = `/genders/list?${query}`;
    return axiosClient.get(url);
  },

  switchActiveGender: (id) => {
    const url = `/genders/set-active?id=${id}`;
    return axiosClient.get(url);
  },

  getItemGender: (id) => {
    const url = `/genders/detail?id=${id}`;
    return axiosClient.get(url);
  },

  deleteItemGender: (id) => {
    const url = `/genders/delete?id=${id}`;
    return axiosClient.get(url);
  },

  editItemGender: (data) => {
    const url = `/genders/update`;
    return axiosClient.post(url, data);
  },

  createItemGender: (data) => {
    const url = `/genders/create`;
    return axiosClient.post(url, data);
  },

  getGenderLabel: () => {
    const url = `/genders/label/list`;
    return axiosClient.get(url);
  },

  getItemGenderLabel: (params) => {
    const url = `/genders/label/${params.id}`;
    const apiConfigcus = {
      headers: apiConfig().headers,
      responseType: apiConfig().responseType,
      params: {
        table: params.tableName,
      },
    };
    return axiosClient.get(url, apiConfigcus);
  },
  editGenderLabel: (data) => {
    const url = `/genders/label`;
    return axiosClient.post(url, data);
  },
  importDataLabel: (data) => {
    const url = `/genders/label/import`;
    return axiosClient.post(url, data);
  },
};

export default genderApi;
