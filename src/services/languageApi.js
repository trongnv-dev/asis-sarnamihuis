import axiosClient from './axiosClient';
import apiConfig from 'lib/api/api';
import queryString from 'query-string';

const languageApi = {
  quickEditLabel: (data) => {
    const url = `/languages/label`;
    return axiosClient.post(url, data);
  },

  getLabelList: (params) => {
    let url = `/languages/label/list`;
    if (params) url = `/languages/label/list?idUserGroup=${params.idUserGroup}&table=${params.table}`;
    return axiosClient.get(url);
  },

  getLanguageList: (params) => {
    const query = queryString.stringify(params);
    const url = `/languages/list?${query}`;
    return axiosClient.get(url);
  },

  switchActiveLanguage: (data) => {
    const url = `/languages/update-status`;
    return axiosClient.post(url, data);
  },

  getItemLanguage: (id) => {
    const url = `/languages/edit?id=${id}`;
    return axiosClient.get(url);
  },

  editItemLanguage: (data) => {
    const url = `/languages/edit`;
    return axiosClient.post(url, data);
  },

  getLanguageLabel: () => {
    const url = `/languages/label/list`;
    return axiosClient.get(url);
  },

  getItemLanguageLabel: (params) => {
    const url = `/languages/label/${params.id}`;
    const apiConfigcus = {
      headers: apiConfig().headers,
      responseType: apiConfig().responseType,
      params: {
        table: params.tableName,
      },
    };
    return axiosClient.get(url, apiConfigcus);
  },
  editLanguageLabel: (data) => {
    const url = `/languages/label`;
    return axiosClient.post(url, data);
  },
  getCurrentLanguage: () => {
    const url = `/common/get-current-language`;
    return axiosClient.get(url);
  },
  getCurrentLanguageList: () => {
    const url = `/common/list-language-active`;
    return axiosClient.get(url);
  },
  setCurrentLanguage: (id) => {
    const url = `/common/set-current-language`;
    return axiosClient.post(url, { idLanguage: id });
  },
  importDataLabel: (data) => {
    const url = `/languages/label/import`;
    return axiosClient.post(url, data);
  },
};

export default languageApi;
