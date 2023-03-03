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
import { LANGUAGE_LABEL_COLUMN } from 'config/data-table-column';
import Head from 'next/head';
import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useDispatch } from 'react-redux';
import { languageApi } from 'services';
import { pageChangeHeaderTitle, setLabel } from 'store/actions';
import styles from 'styles/pages/language-list.module.scss';
import { sortData, getPageConfig, savePageConfig, colTableConfig } from 'utils/';
import { getLanguageLabel } from 'utils/label/';
import { commonApi } from 'services';
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
import { Action, UpdateLabelModal } from '../../components/UI/Language/LanguageLabel';
import { includes } from 'lodash';

const codeTable = 'language.label';
const LanguageLabelPage = (props) => {
  const { userConfig } = props;

  const router = useRouter();

  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataOnPage, setDataOnPage] = React.useState([]);
  const [dataTableLoading, setDataTableLoading] = useState(false);
  const [isReloadData, setIsReloadData] = useState(false);
  const [columns, setColumns] = useState(LANGUAGE_LABEL_COLUMN);
  const [isEdit, setIsEdit] = useState(false);

  const [popupUpdate, setPopupUpdate] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selectedSortLabel, setSelectedSortLabel] = useState(null);
  const [selectedLabelTableName, setSelectedLabelTableName] = useState(null);

  const [page, setPage] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('');
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');

  const [textSearch, setTextSearch] = useState('');
  const [reloadSearch, setReloadSearch] = useState(false);

  const [colTableSearch, setColTableSearch] = useState([
    { name: 'name', value: '', key: 'name' },
    { name: 'code', value: '', key: 'code' },
    { name: 'sort', value: '', key: 'sort' },
  ]);

  const [typeFilter, setTypeFilter] = useState('and');
  const dispatch = useDispatch();
  const [languageLabel, setLanguageLabel] = useState({});

  const render = () => {
    const limit = rowsPerPage;
    const start = (page - 1) * limit;
    const dataOnPage = dataTable.slice(start, start + limit);
    setDataOnPage(dataOnPage);
  };

  const handlePopupUpdate = (idLabel, tableName, sort, isUpdate) => {
    if (isUpdate) {
      router.push(`/languages/label/update/${idLabel}`);
    } else {
      router.push(`/languages/label/${idLabel}`);
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
    if (!page && !rowsPerPage) return;
    savePageConfig(page, rowsPerPage, 'language.label.index');
    render();
  }, [dataTable, page, rowsPerPage, columns]);

  useEffect(() => {
    const rs = sortData(orderBy, order, dataTable);
    setDataTable(rs);
  }, [order, orderBy]);

  useEffect(() => {
    if (data && data.length > 0) {
      const languageLabel = getLanguageLabel(data);
      dispatch(pageChangeHeaderTitle(languageLabel.titlePage));
      dispatch(setLabel({ label: languageLabel }));

      setLanguageLabel(languageLabel);
    }
  }, [data]);

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
    async function getLanguageLabel() {
      setDataTableLoading(true);
      try {
        let response = await languageApi.getLanguageLabel();
        if (response.status === 200) {
          const data = sortData('id', 'asc', response.data.data);
          setData(data);
          setDataTable(data);
          // setCodeTable(response.data.userConfigIndex.code);
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (error) {
        swal.fire({ text: error.message, icon: 'error' });
      }
      setDataTableLoading(false);
    }
    getLanguageLabel();
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
                    <ToggleEditLabel label={languageLabel.tooltipSwitch} />
                    <ImportData label={languageLabel} api={languageApi.importDataLabel} handleReload={handleReload} />
                    <ExportData
                      label={languageLabel}
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
                      label={languageLabel.tooltipSearch}
                    />

                    <SearchByColumn
                      colTableSearch={colTableSearch}
                      setColTableSearch={setColTableSearch}
                      setPage={setPage}
                      setRowsPerPage={setRowsPerPage}
                      isReloadData={isReloadData}
                      setIsReloadData={setIsReloadData}
                      label={languageLabel.tooltipFilter}
                      typeFilter={typeFilter}
                      setTypeFilter={setTypeFilter}
                      handleSearchAndFilter={handleSearchAndFilter}
                    />
                    <ToggleVisibilityColTable
                      userConfig={userConfig}
                      columns={columns}
                      setColumns={setColumns}
                      languageLabel={languageLabel}
                      codeTable={codeTable}
                      label={languageLabel.tooltipShowHideColumn}
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
                            languageLabel={languageLabel}
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
                                        label={languageLabel}
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
                          languageLabel={languageLabel}
                          readOnly={!isEdit}
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
                      title="Update Language Label"
                      tableName={selectedLabelTableName}
                      onClose={() => setPopupUpdate(false)}
                      setIsReloadData={setIsReloadData}
                      isReloadData={isReloadData}
                      setPopupUpdate={setPopupUpdate}
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

export default withAuth(withLayout(() => <TableWithConfig CodeTable={codeTable} PageView={LanguageLabelPage} />));