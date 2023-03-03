import _ from 'lodash';

export function colTableConfig(config, column) {
  const newData = _.cloneDeep(column);
  newData.map((item) => {
    if(config[item.code]!=null)
      return (item.visibility = config[item.code]);
    return (item.visibility = false);
  });
  return newData;
}

export function getPageConfig(codeTable) {
  const configArr = JSON.parse(localStorage.getItem('pageConfig'));
  let pageObj = {};
  if (configArr && configArr.length > 0) {
    const pageConfig = configArr.find((item) => item.codeTable == codeTable);
    if (pageConfig) {
      pageObj.page = pageConfig.page || 1;
      pageObj.rowsPerPage = pageConfig.rowsPerPage || 10;
    }
  }
  return {
    page: pageObj.page || 1,
    rowsPerPage: pageObj.rowsPerPage || 10,
  };
}
export function savePageConfig(page, rowsPerPage, codeTable) {
  const configArr = JSON.parse(localStorage.getItem('pageConfig')) || [];
  const pageConfig = configArr.find((item) => item.codeTable == codeTable);
  if (pageConfig) {
    configArr.map((item) => {
      if (item.codeTable === pageConfig.codeTable) {
        item.page = page;
        item.rowsPerPage = rowsPerPage;
      }
    });
    localStorage.setItem('pageConfig', JSON.stringify(configArr));
  } else {
    const newArr = [...configArr, { page: page, rowsPerPage: rowsPerPage, codeTable: codeTable }];
    localStorage.setItem('pageConfig', JSON.stringify(newArr));
  }
}
