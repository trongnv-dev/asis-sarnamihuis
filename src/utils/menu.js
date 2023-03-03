export function orderMenu(menu, menuList) {
  let array = menuList;

  // bind order in array
  array.forEach((item) => {
    const value = menu.find((ele) => item.id == ele.id);
    if (!value) {
      item.order =
        Math.max.apply(
          Math,
          menu.map(function (o) {
            return o.order;
          })
        ) + 1;
    } else {
      item.order = value.order;
    }
  });

  // conver to nested array then sort
  array = convertMenu(array);
  array.forEach((item) => {
    if (item.children && item.children.length > 0) {
      item.children.sort(function (a, b) {
        return a.order - b.order;
      });
    }
  });
  array.sort(function (a, b) {
    return a.order - b.order;
  });
  saveMenu(array);
  return array;
}
export function convertMenu(array) {
  let newArray = [];
  if (!array.length) {
    return array;
  } else {
    array.forEach((ele1) => {
      ele1.children = [];
      array.forEach((ele2) => {
        if (ele2.parent_id === ele1.id) {
          ele1.children.push(ele2);
        }
      });
    });
    //delete item have parent_id # 0
    newArray = array.filter((ele) => ele.parent_id == 0);
  }
  return newArray;
}

export function saveMenu(array) {
  let count = 1;
  let newArr = [];
  array.forEach((item) => {
    if (item.children && item.children.length > 0) {
      item.children.forEach((ele) => {
        newArr.push({ id: ele.id, order: count });
        count += 1;
      });
    }
    newArr.push({ id: item.id, order: count });
    count += 1;
  });

  localStorage.setItem('menu', JSON.stringify(newArr));

  // return convertMenu(array);
}
