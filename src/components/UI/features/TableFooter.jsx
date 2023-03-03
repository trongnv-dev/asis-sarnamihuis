import TablePagination from '@material-ui/core/TablePagination';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import styles from 'styles/pages/ui/features/table-footer.module.scss';
import { ChangeLabel } from 'components/UI/features';
import { useSelector } from 'react-redux';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 1);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(1, Math.ceil(count / rowsPerPage)));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 1} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 1} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage)}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage)}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function DisplayRow(props) {
  const { page, rowsPerPage, count, languageLabel } = props;
  const from = (page - 1) * rowsPerPage + 1;
  const to = (page - 1) * rowsPerPage + rowsPerPage;

  return (
    <>
      <span className="d-flex justify-content-center align-items-center">
        <ChangeLabel label={languageLabel.paginateShow || { id: 'Show', name: 'Show' }} />
        &nbsp;
        {from}-{to > count ? count : to}&nbsp;
        <ChangeLabel label={languageLabel.paginateOf || { id: 'Of', name: 'Of' }} />
        &nbsp;
        {count}&nbsp;
        <ChangeLabel label={languageLabel.paginateTotalPage || { id: 'total', name: 'total' }} />
      </span>
    </>
  );
}

function TableFooter(props) {
  const { totalItems, rowsPerPage, page, setPage, setRowsPerPage } = props;
  const languageLabel = useSelector((state) => state.language.label);

  const maxPage = Math.ceil(totalItems / rowsPerPage);
  const [jumpToPage, setJumpToPage] = useState(1);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setPage(jumpToPage);
    }
  };

  useEffect(() => {
    setJumpToPage(page);
  }, [page]);

  const handleJumpToPage = (e) => {
    const jumpToPage = parseInt(e.target.value, 10);
    const pageNumber = Math.max(1, jumpToPage);
    setJumpToPage(Math.min(pageNumber, maxPage));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <div className={styles.tableFooter}>
      <div className={styles.lableContainer}>
        <ChangeLabel label={languageLabel.paginateGoto || { id: 'go to', name: 'go to' }} />
        &nbsp;
        <input
          id="  "
          type="number"
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
          onChange={(event) => handleJumpToPage(event)}
          min={1}
          max={maxPage}
          value={jumpToPage}
          className={styles.input}
          autoComplete="off"
        />
      </div>
      <ChangeLabel label={languageLabel.paginateRowsPerPage || { id: 'rows per page', name: 'rows per page' }} />
      <TablePagination
        component="span"
        className={styles.tableMui}
        rowsPerPageOptions={[10, 25, 50, 100]}
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={''}
        labelDisplayedRows={({ count }) => (
          <DisplayRow count={count} page={page} rowsPerPage={rowsPerPage} languageLabel={languageLabel} />
        )}
        ActionsComponent={TablePaginationActions}
      />
    </div>
  );
}

export default TableFooter;
