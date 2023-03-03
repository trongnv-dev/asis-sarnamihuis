import axiosClient from './axiosClient';
import apiConfig from 'lib/api/api';
import queryString from 'query-string';

const sysAttSubApi = {
  quickEditLabel: (params) => {
    const url = `/sysatt-sub/label`;
    return axiosClient.post(url, params);
  },

  getLabelList: (params) => {
    let url = `/sysatt-sub/label/list`;
    if (params) url = `/sysatt-sub/label/list?idUserGroup=${params.idUserGroup}&table=${params.table}`;

    return axiosClient.get(url);
  },
  getSysAttSubList: (params) => {
    const query = queryString.stringify(params);
    
    const url = `/sysatt-sub/list?${query}`;
    return axiosClient.get(url);
  },

  switchActiveSysAttSub: (id) => {
    const url = `/sysatt-sub/set-active?id=${id}`;
    return axiosClient.get(url);
  },

  getItemSysAttSub: (id) => {
    const url = `/sysatt-sub/detail?id=${id}`;
    return axiosClient.get(url);
  },

  deleteItemSysAttSub: (id) => {
    const url = `/sysatt-sub/delete?id=${id}`;
    const apiConfigCus = {
      headers: apiConfig().headers,
      responseType: apiConfig().responseType,
      params: {
        id: id,
      },
    };
    return axiosClient.delete(url, apiConfigCus);
  },

  editItemSysAttSub: (data) => {
    const url = `/sysatt-sub/update`;
    return axiosClient.post(url, data);
  },

  createItemSysAttSub: (data) => {
    const url = `/sysatt-sub/create`;
    return axiosClient.post(url, data);
  },

  getSysAttSubLabel: () => {
    const url = `/sysatt-sub/label/list`;
    return axiosClient.get(url);
  },

  getItemSysAttSubLabel: (params) => {
    const url = `/sysatt-sub/label/${params.id}`;
    const apiConfigcus = {
      headers: apiConfig().headers,
      responseType: apiConfig().responseType,
      params: {
        table: params.tableName,
      },
    };
    return axiosClient.get(url, apiConfigcus);
  },
  editSysAttSubLabel: (data) => {
    const url = `/sysatt-sub/label`;
    return axiosClient.post(url, data);
  },
  importDataLabel: (data) => {
    const url = `/sysatt-sub/label/import`;
    return axiosClient.post(url, data);
  },
};

export default sysAttSubApi;
