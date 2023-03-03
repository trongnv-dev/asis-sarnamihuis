import axiosClient from './axiosClient';
import apiConfig from 'lib/api/api';

const commonApi = {
  colTableConfig: (params) => {
    const url = `/common/upsert-asis-user-config-param`;
    return axiosClient.post(url, params, apiConfig());
  },
  userConfig: (params)=>{
    const url = `/common/user-config-param?code=${params.CodeTable}`;
    return axiosClient.get(url, apiConfig());
  }
};

export default commonApi;
