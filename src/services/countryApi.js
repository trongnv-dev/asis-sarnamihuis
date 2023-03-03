import axiosClient from './axiosClient';
import apiConfig from 'lib/api/api';
import queryString from 'query-string';

const countryApi = {
  quickEditLabel: (data) => {
    const url = `/geo-country/label`;
    return axiosClient.post(url, data);
  },

  getCountryList: (params) => {
    const query = queryString.stringify(params);
    const url = `/geo-country/list?${query}`;
    return axiosClient.get(url);
  },

  getRegionList: () => {
    const url = `/geo-region/list`;
    return axiosClient.get(url);
  },

  getLabelList: (params) => {
    let url = `/geo-country/label/list`;
    if (params) url = `/geo-country/label/list?idUserGroup=${params.idUserGroup}&table=${params.table}`;
    return axiosClient.get(url);
  },

  switchActiveCountry: (data) => {
    const url = `/geo-country/set-active`;
    return axiosClient.post(url, data);
  },

  getItemCountry: (id) => {
    const url = `/geo-country/detail?id=${id}`;
    return axiosClient.get(url);
  },

  deleteItemCountry: (id) => {
    const url = `/geo-country/delete?id=${id}`;
    const apiConfigCus = {
      headers: apiConfig().headers,
      responseType: apiConfig().responseType,
      params: {
        id: id,
      },
    };
    return axiosClient.delete(url, apiConfigCus);
  },

  editItemCountry: (data) => {
    const url = `/geo-country/update`;
    return axiosClient.post(url, data);
  },

  createItemCountry: (data) => {
    const url = `/geo-country/create`;
    return axiosClient.post(url, data);
  },

  getCountryLabel: () => {
    const url = `/geo-country/label/list`;
    return axiosClient.get(url);
  },

  getItemCountryLabel: (params) => {
    const url = `/geo-country/label/${params.id}`;
    const apiConfigcus = {
      headers: apiConfig().headers,
      responseType: apiConfig().responseType,
      params: {
        table: params.tableName,
      },
    };
    return axiosClient.get(url, apiConfigcus);
  },
  editCountryLabel: (data) => {
    const url = `/geo-country/label`;
    return axiosClient.post(url, data);
  },
  importDataLabel: (data) => {
    const url = `/geo-country/label/import`;
    return axiosClient.post(url, data);
  },
};

export default countryApi;
