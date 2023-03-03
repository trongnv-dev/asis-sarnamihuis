import axiosClient from './axiosClient';
import apiConfig from 'lib/api/api';
import queryString from 'query-string';

const regionApi = {
  quickEditLabel: (params) => {
    const url = `/geo-region/label`;
    return axiosClient.post(url, params);
  },

  getRegionList: (params) => {
    const query = queryString.stringify(params).replace('parentId=0',`parentId='0'`);
    const url = `/geo-region/list?${query}`;
    return axiosClient.get(url);
  },

  getChildRegionList: (parentId) => {
    const url = `/geo-region/list?parentId=${parentId}`;
    return axiosClient.get(url);
  },

  getLabelList: (params) => {
    let url = `/geo-region/label/list`;
    if (params) url = `/geo-region/label/list?idUserGroup=${params.idUserGroup}&table=${params.table}`;
    return axiosClient.get(url);
  },

  switchActiveRegion: (data) => {
    const url = `/geo-region/set-active`;
    return axiosClient.post(url, data);
  },

  getItemRegion: (id) => {
    const url = `/geo-region/detail?id=${id}`;
    return axiosClient.get(url);
  },

  deleteItemRegion: (id) => {
    const url = `/geo-region/delete?id=${id}`;
    const apiConfigCus = {
      headers: apiConfig().headers,
      responseType: apiConfig().responseType,
      params: {
        id: id,
      },
    };
    return axiosClient.delete(url, apiConfigCus);
  },

  editItemRegion: (data) => {
    const url = `/geo-region/update`;
    return axiosClient.post(url, data);
  },

  createItemRegion: (data) => {
    const url = `/geo-region/create`;
    return axiosClient.post(url, data);
  },

  getRegionLabel: () => {
    const url = `/geo-region/label/list`;
    return axiosClient.get(url);
  },

  getItemRegionLabel: (params) => {
    const url = `/geo-region/label/${params.id}`;
    const apiConfigcus = {
      headers: apiConfig().headers,
      responseType: apiConfig().responseType,
      params: {
        table: params.tableName,
      },
    };
    return axiosClient.get(url, apiConfigcus);
  },

  editRegionLabel: (data) => {
    const url = `/geo-region/label`;
    return axiosClient.post(url, data);
  },

  importDataLabel: (data) => {
    const url = `/geo-region/label/import`;
    return axiosClient.post(url, data);
  },
};

export default regionApi;
