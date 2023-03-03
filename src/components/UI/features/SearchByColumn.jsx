import { faFilter } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useEffect } from 'react';
import MenuPopupState from './MenuPopupState';
import _debounce from 'lodash/debounce';
import ChangeLabel from './ChangeLabel';

const SearchByColumn = (props) => {
  const {
    colTableSearch,
    setColTableSearch,
    setPage,
    setRowsPerPage,
    isReloadData,
    setIsReloadData,
    label,
    typeFilter,
    setTypeFilter,
    handleSearchAndFilter,
  } = props;

  function handleSearchByColumn(e, name) {
    const keySearch = e.target.value;
    const newCol = [];
    colTableSearch.map((data) => {
      if (data.name !== name) {
        newCol.push(data);
        return;
      }
      newCol.push({ ...data, value: keySearch });
    });
    setColTableSearch(newCol);
  }

  const itemsList = [];
  if (colTableSearch && colTableSearch.length > 0) {
    colTableSearch.map((data) => {
      if (!data.isDisplay) return;
      itemsList.push(
        <input
          placeholder={data.name}
          value={data.value}
          onChange={(e) => {
            handleSearchByColumn(e, data.name);
          }}
        />
      );
    });
  }

  return (
    <div style={{ margin: '0 10px' }}>
      <MenuPopupState
        menuList={itemsList}
        icon={faFilter}
        tooltip={<ChangeLabel label={label} />}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        handleSearchAndFilter={handleSearchAndFilter}
      />
    </div>
  );
};

export default SearchByColumn;
