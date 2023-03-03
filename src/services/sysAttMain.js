import axiosClient from './axiosClient';
import apiConfig from 'lib/api/api';
import queryString from 'query-string';

const sysAttMainApi = {
  quickEditLabel: (params) => {
    const url = `/sysatt-main/label`;
    return axiosClient.post(url, params);
  },

  getLabelList: (params) => {
    let url = `/sysatt-main/label/list`;
    if (params) url = `/sysatt-main/label/list?idUserGroup=${params.idUserGroup}&table=${params.table}`;

    return axiosClient.get(url);
  },
  getSysAttMainList: (params) => {
    const query = queryString.stringify(params);
    const url = `/sysatt-main/list?${query}`;
    return axiosClient.get(url);
  },

  switchActiveSysAttMain: (id) => {
    const url = `/sysatt-main/set-active?id=${id}`;
    return axiosClient.get(url);
  },

  getItemSysAttMain: (id) => {
    const url = `/sysatt-main/detail?id=${id}`;
    return axiosClient.get(url);
  },

  deleteItemSysAttMain: (id) => {
    const url = `/sysatt-main/delete?id=${id}`;
    const apiConfigCus = {
      headers: apiConfig().headers,
      responseType: apiConfig().responseType,
      params: {
        id: id,
      },
    };
    return axiosClient.delete(url, apiConfigCus);
  },

  editItemSysAttMain: (data) => {
    const url = `/sysatt-main/update`;
    return axiosClient.post(url, data);
  },

  createItemSysAttMain: (data) => {
    const url = `/sysatt-main/create`;
    return axiosClient.post(url, data);
  },

  getSysAttMainLabel: () => {
    const url = `/sysatt-main/label/list`;
    return axiosClient.get(url);
  },

  getItemSysAttMainLabel: (params) => {
    const url = `/sysatt-main/label/${params.id}`;
    const apiConfigcus = {
      headers: apiConfig().headers,
      responseType: apiConfig().responseType,
      params: {
        table: params.tableName,
      },
    };
    return axiosClient.get(url, apiConfigcus);
  },
  editSysAttMainLabel: (data) => {
    const url = `/sysatt-main/label`;
    return axiosClient.post(url, data);
  },
  importDataLabel: (data) => {
    const url = `/sysatt-main/label/import`;
    return axiosClient.post(url, data);
  },
};

export default sysAttMainApi;
