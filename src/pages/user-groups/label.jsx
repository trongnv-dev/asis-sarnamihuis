import { Col, Container, Portlet, Row } from '@blueupcode/components';
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import { swal } from 'components/swal/instance';
import PAGE from 'config/page.config';
import { USER_GROUP_LABEL_COLUMN } from 'config/data-table-column';
import Head from 'next/head';
import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useDispatch } from 'react-redux';
import { userGroupApi, commonApi } from 'services';
import { pageChangeHeaderTitle, setLabel } from 'store/actions';
import styles from 'styles/pages/userGroup-list.module.scss';
import { sortData, colTableConfig } from 'utils/';
import { getUserGroupLabel } from 'utils/label/';
import {
  ExportData,
  ImportData,
  SearchByColumn,
  SearchByKeyword,
  TableFooter,
  TableHeader,
  ToggleEditLabel,
  ToggleVisibilityColTable,
  TableWithConfig,
} from '../../components/UI/features';
import { Action, UpdateLabelModal } from '../../components/UI/UserGroup/UserGroupLabel';
import { includes } from 'lodash';

const colTableSearchDefault = [
  { name: 'name', value: '', key: 'name' },
  { name: 'code', value: '', key: 'code' },
  { name: 'sort', value: '', key: 'sort' },
];
const codeTable = 'userGroup.label';

const UserGroupLabelPage = (props) => {
  const { userConfig } = props;

  const router = useRouter();

  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataOnPage, setDataOnPage] = React.useState([]);
  const [dataTableLoading, setDataTableLoading] = useState(false);
  const [isReloadData, setIsReloadData] = useState(false);
  const [columns, setColumns] = useState(USER_GROUP_LABEL_COLUMN);
  const [isEdit, setIsEdit] = useState(false);

  const [popupUpdate, setPopupUpdate] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selectedSortLabel, setSelectedSortLabel] = useState(null);
  const [selectedLabelTableName, setSelectedLabelTableName] = useState(null);

  const [page, setPage] = useState('1');
  const [rowsPerPage, setRowsPerPage] = useState('');
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');

  const [textSearch, setTextSearch] = useState('');
  const [colTableSearch, setColTableSearch] = useState(colTableSearchDefault);
  const [reloadSearch, setReloadSearch] = useState(false);

  const [typeFilter, setTypeFilter] = useState('and');
  const dispatch = useDispatch();
  const [userGroupLabel, setUserGroupLabel] = useState({});

  const render = () => {
    const limit = rowsPerPage;
    const start = (page - 1) * limit;
    const dataOnPage = dataTable.slice(start, start + limit);
    setDataOnPage(dataOnPage);
  };

  const handlePopupUpdate = (idLabel, tableName, sort, isUpdate) => {
    if (isUpdate) {
      router.push(`/user-groups/label/update/${idLabel}`);
    } else {
      router.push(`/user-groups/label/${idLabel}`);
    }
  };

  const handleReload = () => {
    setIsReloadData(!isReloadData);
  };

  useEffect(() => {
    setPage(userConfig.page);
    setRowsPerPage(userConfig.per_page);
    var colConfig = colTableConfig(userConfig.column_config, columns);
    setColumns(colConfig);
    var col = [];
    colTableSearch.filter((item) => {
      colConfig.filter((itemF) => {
        if (itemF.key == item.key && itemF.visibility == true) {
          col.push(item);
        }
      });
    });
    setColTableSearch(col);
  }, []);

  useEffect(() => {
    async function saveConfig() {
      try {
        userConfig.page = page;
        userConfig.per_page = rowsPerPage;

        await commonApi.colTableConfig({
          code: codeTable,
          value: userConfig,
        });
      } catch (error) {
        swal.fire({ text: error.message, icon: 'error' });
      }
    }
    if ((page != '' && userConfig.page != page) || (rowsPerPage != '' && userConfig.per_page != rowsPerPage)) {
      saveConfig();
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    render();
  }, [dataTable, page, rowsPerPage, columns]);

  useEffect(() => {
    const rs = sortData(orderBy, order, dataTable);
    setDataTable(rs);
  }, [order, orderBy]);

  useEffect(() => {
    if (data && data.length > 0) {
      const userGroupLabel = getUserGroupLabel(data);
      dispatch(pageChangeHeaderTitle(userGroupLabel.titlePage));
      dispatch(setLabel({ label: userGroupLabel }));
      setUserGroupLabel(userGroupLabel);
    }
  }, [data]);

  useEffect(() => {
    setDataTableLoading(true);
    async function getUserGroupLabel() {
      try {
        let response = await userGroupApi.getUserGroupLabel();
        if (response.status === 200) {
          const data = sortData('id', 'asc', response.data.data);
          setData(data);
          setDataTable(data);
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (error) {
        swal.fire({ text: error.message, icon: 'error' });
      }
      setDataTableLoading(false);
    }
    getUserGroupLabel();
  }, []);

  const handleSearchAndFilter = (type) => {
    let newData = [...data];

    newData = newData.filter((item) => {
      let str = '';
      columns.forEach((element) => {
        str += `${item[element.key]}# `;
      });
      return str.toString().toLowerCase().includes(textSearch.toLowerCase());
    });

    if (type === 'clear') {
      setTypeFilter('and');
      setColTableSearch((prev) => {
        return prev.map((item) => {
          return {
            ...item,
            value: '',
          };
        });
      });
    } else {
      if (typeFilter === 'and') {
        colTableSearch.forEach((col) => {
          newData = newData.filter((data) => {
            return data[col.key].toString().toLowerCase().includes(col.value.toLowerCase());
          });
        });
      } else {
        let dataTypeOr = [];
        colTableSearch.forEach((col) => {
          if (col.value) {
            const list = newData.filter((data) => {
              console.log(dataTypeOr, data[col.key], includes(dataTypeOr, data[col.key]));
              return (
                data[col.key].toString().toLowerCase().includes(col.value.toLowerCase()) && !includes(dataTypeOr, data)
              );
            });
            dataTypeOr = [...dataTypeOr, ...list];
          }
        });
        newData = dataTypeOr;
      }
    }

    setDataTable(newData);
    setPage(1);
  };
  useEffect(() => {
    handleSearchAndFilter();
  }, [data, textSearch]);

  useEffect(() => {
    setColTableSearch([
      { name: 'name', value: '', key: 'name', isDisplay: userConfig.column_config.column_name },
      { name: 'code', value: '', key: 'code', isDisplay: userConfig.column_config.column_code },
      { name: 'sort', value: '', key: 'sort', isDisplay: userConfig.column_config.column_sort },
    ]);
  }, [userConfig]);

  return (
    <Fragment>
      <Head>
        <title>Table | {PAGE.siteName}</title>
      </Head>
      <Container fluid>
        {dataTableLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : data && data.length > 0 ? (
          <Row>
            <Col md="12">
              <Portlet>
                <Portlet.Header>
                  <div className={styles.tableHeader}>
                    <ToggleEditLabel label={userGroupLabel.tooltipSwitch} />
                    <ImportData label={userGroupLabel} api={userGroupApi.importDataLabel} handleReload={handleReload} />
                    <ExportData
                      label={userGroupLabel}
                      data={data}
                      dataFilter={dataTable}
                      dataOnPage={dataOnPage}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      columns={columns}
                      isPageLabel={true}
                    />
                    <SearchByKeyword
                      textSearch={textSearch}
                      setTextSearch={setTextSearch}
                      isReloadData={reloadSearch}
                      setIsReloadData={setReloadSearch}
                      setPage={setPage}
                      setRowsPerPage={setRowsPerPage}
                      label={userGroupLabel.tooltipSearch}
                    />
                    <SearchByColumn
                      colTableSearch={colTableSearch}
                      setColTableSearch={setColTableSearch}
                      setPage={setPage}
                      setRowsPerPage={setRowsPerPage}
                      isReloadData={isReloadData}
                      setIsReloadData={setIsReloadData}
                      label={userGroupLabel.tooltipFilter}
                      typeFilter={typeFilter}
                      setTypeFilter={setTypeFilter}
                      handleSearchAndFilter={handleSearchAndFilter}
                    />
                    <ToggleVisibilityColTable
                      userConfig={userConfig}
                      columns={columns}
                      setColumns={setColumns}
                      languageLabel={userGroupLabel}
                      codeTable={codeTable}
                      label={userGroupLabel.tooltipShowHideColumn}
                    />
                  </div>
                </Portlet.Header>
                <Portlet.Body>
                  <Box sx={{ width: '100%' }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                      <TableContainer>
                        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                          <TableHeader
                            order={order}
                            orderBy={orderBy}
                            setOrderBy={setOrderBy}
                            setOrder={setOrder}
                            columns={columns}
                            languageLabel={userGroupLabel}
                          />
                          <TableBody>
                            {dataOnPage.map((row, index) => (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={`label-table-cell-${row.code}-${index}`}
                              >
                                {columns.map((column) =>
                                  column.visibility && column.label === 'action' ? (
                                    <TableCell
                                      align="left"
                                      width="10px"
                                      className={styles.tableCell}
                                      key={`label-table-cell-${column.key}-${row.code}`}
                                    >
                                      <Action
                                        sort={row.sort}
                                        id={row.id}
                                        table={row.table}
                                        handlePopupUpdate={handlePopupUpdate}
                                        label={userGroupLabel}
                                      />
                                    </TableCell>
                                  ) : (
                                    column.visibility && (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`label-table-cell-${column.key}-${row.code}`}
                                      >
                                        {row[column.label]}
                                      </TableCell>
                                    )
                                  )
                                )}
                              </TableRow>
                            ))}
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
                  {popupUpdate && (
                    <UpdateLabelModal
                      sort={selectedSortLabel}
                      id={selectedLabel}
                      title="Update UserGroup Label"
                      tableName={selectedLabelTableName}
                      onClose={() => setPopupUpdate(false)}
                      setIsReloadData={setIsReloadData}
                      isReloadData={isReloadData}
                      setPopupUpdate={setPopupUpdate}
                      readOnly={!isEdit}
                    />
                  )}
                </Portlet.Body>
              </Portlet>
            </Col>
          </Row>
        ) : (
          <Typography align="center" className={styles.noData}>
            There are no labels to display
          </Typography>
        )}
      </Container>
    </Fragment>
  );
};
export default withAuth(withLayout(() => <TableWithConfig CodeTable={codeTable} PageView={UserGroupLabelPage} />));
