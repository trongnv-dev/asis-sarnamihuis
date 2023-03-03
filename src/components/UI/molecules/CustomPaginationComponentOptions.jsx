import { IconButton } from '@material-ui/core';
import TablePagination from '@material-ui/core/TablePagination';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import React from 'react';
import { useSelector } from "react-redux";

const TablePaginationActions = ({ count, page, rowsPerPage, onChangePage }) => {
  const handleFirstPageButtonClick = () => {
    onChangePage(1);
  };

  const handleBackButtonClick = () => {
    onChangePage(page);
  };

  const handleNextButtonClick = () => {
    onChangePage(page + 2);
  };

  const handleLastPageButtonClick = () => {
    onChangePage(getNumberOfPages(count, rowsPerPage));
  };

  const getNumberOfPages = (count, rowsPerPage) => {
    return Math.ceil(count/rowsPerPage);
  }
  return (
    <>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= getNumberOfPages(count, rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= getNumberOfPages(count, rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </>
  );
}

const CustomPaginationComponentOptions = ({
  rowsPerPage, rowCount, onChangePage, onChangeRowsPerPage, currentPage
}) => {
  const [jump, setJump] = React.useState(1);

  const _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onChangePage(jump)
    }
  }
  const dataLabel = useSelector((state) => state.language?.label.data);

  const styles = {
    main: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "flex-end"
    },
    lableContainer: {
      padding: 16
    },
    label: {
      paddingRight: 16
    },
    input: {
      width: 60,
      paddingLeft: 5,
      paddingRight: 5
    },
    pagination: {
      color: "#757575",
      fontSize: "1rem !important",
      fontWeight: 400
    }
  }

  return (
  <div style={styles.main}>
    <div style={styles.lableContainer}>
      <label for="jumpToPage" style={styles.label}>{dataLabel?.find((item) => item.code === "language.index.goto_page").name}</label>
      <input id="jumpToPage" 
        type="number" 
        onKeyDown={_handleKeyDown} 
        onChange={event => setJump(event.target.value)} 
        min={1} 
        defaultValue={jump}
        style={styles.input}
      />
    </div>
    <TablePagination
      component="nav"
      count={rowCount}
      rowsPerPage={rowsPerPage}
      page={currentPage - 1}
      onChangePage={onChangePage}
      onChangeRowsPerPage={({ target }) => onChangeRowsPerPage(Number(target.value))}
      ActionsComponent={TablePaginationActions}
      style={styles.pagination}
    />
  </div>
  )
}

export default CustomPaginationComponentOptions
