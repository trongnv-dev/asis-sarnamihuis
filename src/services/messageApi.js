import axiosClient from './axiosClient';
import queryString from 'query-string';

const messageApi = {
  getLabelList: (params) => {
    let url = `/message/label/list`;
    return axiosClient.get(url);
  },
  getMessageList: (params) => {
    const query = queryString.stringify(params);
    const url = `/message/list?${query}`;
    return axiosClient.get(url);
  },
  getItemMessage: (id) => {
    const url = `/message/detail?id=${id}`;
    return axiosClient.get(url);
  },
  editItemMessage: (data) => {
    const url = `/message/update`;
    return axiosClient.post(url, data);
  },
  getMessageLabel: () => {
    const url = `/message/label/list`;
    return axiosClient.get(url);
  },
};

export default messageApi;
