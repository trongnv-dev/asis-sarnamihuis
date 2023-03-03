import * as SolidIcon from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextField } from '@material-ui/core';
import Collapse from '@mui/material/Collapse';
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import styles from 'styles/pages/ui/features/search-by-keyword.module.scss';
import _debounce from 'lodash/debounce';
import Tooltip from '@mui/material/Tooltip';
import ChangeLabel from './ChangeLabel';

const ClearButton = styled.div`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 32px;
  padding: 0 15px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #2196f3;

  &:hover {
    background-color: #2196f3;
  }
`;

const SearchBox = (props) => {
  const { textSearch, setTextSearch, isReloadData, isOpen, debounceSearching } = props;

  function handleSearch(e) {
    setTextSearch(e);
    debounceSearching(!isReloadData);
  }
  return (
    <>
      <TextField
        id="search"
        type="text"
        value={textSearch}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
        style={{
          width: `${isOpen ? '200px' : '0'}`,
          // transition: ` width 0.75s cubic-bezier(0.000, 0.795, 0.000, 1.000)`,
          border: `1px solid  black`,
          borderTopLeftRadius: '10px',
          borderBottomLeftRadius: '10px',
          padding: '2px 10px 0px 10px',
          marginLeft: '10px',
        }}
        InputProps={{
          disableUnderline: true,
          autoComplete: 'off',
        }}
      ></TextField>
    </>
  );
};

const SearchByKeyword = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isReloadData, setIsReloadData, setTextSearch, setPage, setRowsPerPage, label } = props;

  const debounceSearching = useCallback(
    _debounce((value) => {
      setIsReloadData(value), setPage(1), setRowsPerPage(10);
    }, 1200),
    []
  );

  function onClear() {
    setTextSearch('');
    debounceSearching(!isReloadData);
  }
  function showSearchBox() {
    setIsOpen(true);
  }

  function handCloseSearch() {
    onClear();
    setIsOpen(false);
  }

  return (
    <div className={styles.search}>
      <Collapse in={isOpen} orientation="horizontal">
        <SearchBox {...props} isOpen={isOpen} debounceSearching={debounceSearching} />
      </Collapse>
      <div>
        {!isOpen ? (
          <Tooltip title={<ChangeLabel label={label} />} placement="top">
            <div className={styles.search_icon} onClick={showSearchBox}>
              <FontAwesomeIcon icon={SolidIcon.faSearch} />
            </div>
          </Tooltip>
        ) : (
          <ClearButton type="button" onClick={() => handCloseSearch()}>
            X
          </ClearButton>
        )}
      </div>
    </div>
  );
};

export default SearchByKeyword;
