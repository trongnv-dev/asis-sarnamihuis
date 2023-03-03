import _ from 'lodash';
const columnTypeString = ['name', 'code', 'dateFormat', 'culture'];
const columnTypeNumber = ['id', 'isActive', 'sort'];

function convertData(data) {
  const newData = _.cloneDeep(data);
  return newData.map((item) => {
    if (item.icon) {
      item.icon = item.icon.props ? item.icon.props.src : item.icon;
    }
    if (item.isActive || item.isActive === 0) {
      item.isActive = item.isActive.props ? item.isActive.props.isActive : item.isActive;
    }
    return item;
  });
}

export function sortString(data, key, type) {
  let sortMethod = -1;
  if (type == 'asc') {
    sortMethod = 1;
  }

  data.sort(function (elem1, elem2) {
    var elem1Var = elem1[key];
    var elem2Var = elem2[key];

    if (elem1Var < elem2Var) {
      return -1 * sortMethod;
    }

    if (elem1Var > elem2Var) {
      return 1 * sortMethod;
    }
    return 0;
  });
  return data;
}

export function sortNumber(data, key, sortDirection) {
  return data.sort((firstItem, secondItem) =>
    sortDirection === 'asc' ? firstItem[key] - secondItem[key] : secondItem[key] - firstItem[key]
  );
}

export function sortData(column, sortDirection, data) {
  let newData = convertData(data);
  if (columnTypeString.includes(column)) {
    newData = sortString(newData, column, sortDirection);
  } else if (columnTypeNumber.includes(column)) {
    newData = sortNumber(newData, column, sortDirection);
  }
  return newData;
}
