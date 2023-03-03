import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
} from '@mui/material';
import { TableFooter, TableHeader } from 'components/UI/features';
import { Action, ToggleActive } from 'components/UI/Language/LanguageList';
import React, { useEffect, useState } from 'react';
import styles from 'styles/pages/language-list.module.scss';

const columns = ['ID', 'Name', 'Code', 'Permission'];
const List = (props) => {
  const { permissionsSelected, userGroupSelected, setDataPermission, setIsSave, readOnly } = props;
  const [tableLoading, setTableLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dataOnPage, setDataOnPage] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const render = () => {
    const limit = rowsPerPage;
    const start = (page - 1) * limit;
    const dataOnPage = dataTable.slice(start, start + limit);
    setDataOnPage(dataOnPage);
  };
  const handleChange = (item) => {
    const newData = [...dataTable].map((e) => {
      return e.code === item.code ? { ...e, isPermission: !e.isPermission } : e;
    });
    setDataTable(newData);
    setDataPermission(newData);
    setIsSave(true);
  };
  useEffect(() => {
    render();
  }, [dataTable, page, rowsPerPage, columns]);

  useEffect(() => {
    if (!(permissionsSelected && permissionsSelected.length > 0 && userGroupSelected)) return;
    async function fetchApi() {
      setTableLoading(true);
      let newData = [];
      await Promise.allSettled(
        permissionsSelected.map(async (item) => {
          return item.api.getLabelList({ idUserGroup: userGroupSelected, table: 'viewControl' });
        })
      )
        .then((results) => {
          results.forEach((e) => (e.status === 'fulfilled' ? (newData = [...newData, ...e.value.data.data]) : null));
          setDataTable(newData);
        })
        .catch((error) => {
          console.log(error);
        });
      setTableLoading(false);
    }
    fetchApi();
  }, [permissionsSelected, userGroupSelected]);

  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
              <TableHead>
                <TableRow>
                  {columns.map((headCell, index) => (
                    <TableCell key={index} align="left" style={{ fontSize: '15px', fontWeight: 'bold' }}>
                      {headCell}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableLoading ? (
                  <TableRow>
                    <TableCell align="center" colSpan={10}>
                      <div className={styles.loading}>
                        <CircularProgress disableShrink />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {dataOnPage.map((item, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={`permission-${index}`}>
                        <TableCell align="left" width="10%" className={styles.tableCellAddPermission}>
                          {item.id}
                        </TableCell>
                        <TableCell align="left" width="10%" className={styles.tableCellAddPermission}>
                          {item.name}
                        </TableCell>
                        <TableCell align="left" width="10%" className={styles.tableCellAddPermission}>
                          {item.code}
                        </TableCell>
                        <TableCell align="left" width="10%" className={styles.tableCellAddPermission}>
                          <Checkbox
                            checked={item.isPermission}
                            disabled={readOnly}
                            onChange={() => handleChange(item)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {dataOnPage && dataOnPage.length > 0 ? (
            <TableFooter
              totalItems={dataTable.length}
              rowsPerPage={rowsPerPage}
              page={page}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
          ) : (
            <Typography align="center" className={styles.noData}>
              There are no records to display
            </Typography>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default List;
