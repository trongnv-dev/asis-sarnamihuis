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
import {
  ButtonPermission,
  ExportData,
  ImportData,
  SearchByColumn,
  SearchByKeyword,
  TableFooter,
  TableHeader,
  TableWithConfig,
  ToggleEditLabel,
  ToggleVisibilityColTable,
} from 'components/UI/features';
import { Action, ModalSwitchLanguage, ToggleActive, UpdateLanguageModal } from 'components/UI/Language/LanguageList';
import { LANGUAGE_COLUMN } from 'config/data-table-column';
import PAGE from 'config/page.config';
import Head from 'next/head';
import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useDispatch } from 'react-redux';
import { commonApi, languageApi } from 'services';
import { pageChangeHeaderTitle, setLabel } from 'store/actions';
import styles from 'styles/pages/language-list.module.scss';
import { colTableConfig, getLanguageList } from 'utils/';
const codeTable = 'language.index';

const ListLanguagesPage = (props) => {
  const { userConfig } = props;

  const router = useRouter();

  const [dataOnPage, setDataOnPage] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isReloadData, setIsReloadData] = useState(false);
  const [columns, setColumns] = useState(LANGUAGE_COLUMN);
  const [isEdit, setIsEdit] = useState(false);

  const [popUpConfirm, setPopUpConfirm] = useState(false);
  const [currentStatusLanguage, setCurrentStatusLanguage] = useState(false);
  const [currentIdLanguage, setCurrentIdLanguage] = useState(null);
  const [popupUpdateLanguage, setPopupUpdateLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const [page, setPage] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('');
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const [totalPage, setTotalPage] = useState(0);

  const [textSearch, setTextSearch] = useState('');
  const [colTableSearch, setColTableSearch] = useState([
    { name: 'id', value: '', key: 'id', isDisplay: false },
    { name: 'name', value: '', key: 'name', isDisplay: false },
    { name: 'code', value: '', key: 'code', isDisplay: false },
    { name: 'date format', value: '', key: 'date_format', isDisplay: false },
    { name: 'culture', value: '', key: 'culture', isDisplay: false },
  ]);

  const [typeFilter, setTypeFilter] = useState('and');
  const dispatch = useDispatch();
  const [languageLabel, setLanguageLabel] = useState({});
  const [dataLabel, setDataLabel] = useState([]);

  const handlePopupUpdateLanguage = (idLanguage, isUpdate) => {
    if (isUpdate) {
      router.push(`/languages/update/${idLanguage}`);
    } else {
      router.push(`/languages/${idLanguage}`);
    }
  };

  const getDataExport = async (isSearchAll) => {
    try {
      let response = await languageApi.getLanguageList({
        orderBy: orderBy,
        direction: order,
        perPage: '',
        page: page,
        searchAll: isSearchAll ? '' : textSearch,
        id: colTableSearch.find((item) => item.key === 'id').value,
        name: colTableSearch.find((item) => item.key === 'name').value,
        code: colTableSearch.find((item) => item.key === 'code').value,
        dateFormat: colTableSearch.find((item) => item.key === 'date_format').value,
        culture: colTableSearch.find((item) => item.key === 'culture').value,
        filterOption: typeFilter,
      });
      if (response.status === 200) {
        return response.data.data;
      } else {
        swal.fire({ text: response.statusText, icon: 'error' });
      }
    } catch (error) {
      swal.fire({ text: error.message, icon: 'error' });
    }
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
    if (dataLabel && dataLabel.length > 0) {
      const languageLabel = getLanguageList(dataLabel);
      dispatch(pageChangeHeaderTitle(languageLabel.titlePage));
      dispatch(setLabel({ label: languageLabel }));
      setLanguageLabel(languageLabel);
    }
  }, [dataLabel]);

  useEffect(() => {
    setPageLoading(true);
    async function fetchLanguageLabel() {
      try {
        let response = await languageApi.getLanguageLabel();
        if (response.status === 200) {
          setDataLabel(response.data.data);
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (error) {
        swal.fire({ text: error.message, icon: 'error' });
      }
      setPageLoading(false);
    }
    fetchLanguageLabel();
  }, []);

  useEffect(() => {
    async function fetchLanguageList() {
      setTableLoading(true);
      try {
        let response = await languageApi.getLanguageList({
          orderBy: orderBy,
          direction: order,
          perPage: rowsPerPage,
          page: page,
          searchAll: textSearch,
          id: colTableSearch.find((item) => item.key === 'id').value,
          name: colTableSearch.find((item) => item.key === 'name').value,
          code: colTableSearch.find((item) => item.key === 'code').value,
          dateFormat: colTableSearch.find((item) => item.key === 'date_format').value,
          culture: colTableSearch.find((item) => item.key === 'culture').value,
          filterOption: typeFilter,
        });
        if (response.status === 200) {
          setTotalPage(response.data.meta.total[0]);
          setDataOnPage(response.data.data);
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (error) {
        swal.fire({ text: error.message, icon: 'error' });
      }
      setTableLoading(false);
    }
    if (!page && !rowsPerPage) return;
    fetchLanguageList();
  }, [isReloadData, page, rowsPerPage, order, orderBy]);

  useEffect(() => {
    async function saveConfig() {
      setTableLoading(true);
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
      setTableLoading(false);
    }
    if ((page != '' && userConfig.page != page) || (rowsPerPage != '' && userConfig.per_page != rowsPerPage)) {
      saveConfig();
    }
  }, [page, rowsPerPage]);

  const handleSearchAndFilter = useCallback(
    (type) => {
      if (type === 'clear') {
        setColTableSearch([
          { name: 'id', value: '', key: 'id', isDisplay: userConfig.column_config.column_id },
          { name: 'name', value: '', key: 'name', isDisplay: userConfig.column_config.column_name },
          { name: 'code', value: '', key: 'code', isDisplay: userConfig.column_config.column_code },
          {
            name: 'date format',
            value: '',
            key: 'date_format',
            isDisplay: userConfig.column_config.column_date_format,
          },
          { name: 'culture', value: '', key: 'culture', isDisplay: userConfig.column_config.column_culture },
        ]);
        setTypeFilter('and');
      }
      setPage(1);
      setRowsPerPage(10);
      setIsReloadData(!isReloadData);
    },
    [isReloadData]
  );

  useEffect(() => {
    setColTableSearch([
      { name: 'id', value: '', key: 'id', isDisplay: userConfig.column_config.column_id },
      { name: 'name', value: '', key: 'name', isDisplay: userConfig.column_config.column_name },
      { name: 'code', value: '', key: 'code', isDisplay: userConfig.column_config.column_code },
      { name: 'date format', value: '', key: 'date_format', isDisplay: userConfig.column_config.column_date_format },
      { name: 'culture', value: '', key: 'culture', isDisplay: userConfig.column_config.column_culture },
    ]);
  }, [userConfig]);

  return (
    <Fragment>
      <Head>
        <title>Table | {PAGE.siteName}</title>
      </Head>
      <Container fluid>
        {pageLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : dataLabel && dataLabel.length > 0 ? (
          <Row>
            <Col md="12">
              <Portlet>
                <Portlet.Header>
                  <div className={styles.tableHeader}>
                    <ButtonPermission
                      component={ToggleEditLabel}
                      permission={true}
                      label={languageLabel.tooltipSwitch}
                    />
                    <ButtonPermission
                      component={ImportData}
                      permission={languageLabel.btnImport?.isPermission}
                      label={languageLabel}
                      disableBtn={true}
                    />
                    <ButtonPermission
                      component={ExportData}
                      permission={languageLabel.btnExport?.isPermission}
                      label={languageLabel}
                      dataOnPage={dataOnPage}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      columns={columns}
                      isPageLabel={false}
                      dataListPageExport={getDataExport}
                    />
                    <ButtonPermission
                      component={SearchByKeyword}
                      permission={true}
                      textSearch={textSearch}
                      setTextSearch={setTextSearch}
                      isReloadData={isReloadData}
                      setIsReloadData={setIsReloadData}
                      setPage={setPage}
                      setRowsPerPage={setRowsPerPage}
                      label={languageLabel.tooltipSearch}
                    />
                    <ButtonPermission
                      component={SearchByColumn}
                      permission={true}
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
                    <ButtonPermission
                      component={ToggleVisibilityColTable}
                      permission={true}
                      columns={columns}
                      setColumns={setColumns}
                      languageLabel={languageLabel}
                      codeTable={codeTable}
                      userConfig={userConfig}
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
                          {tableLoading ? (
                            <TableRow>
                              <TableCell align="center" colSpan={10}>
                                <div className={styles.loading}>
                                  <CircularProgress disableShrink />
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            <TableBody>
                              {dataOnPage.map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={`language-${row.id}`}>
                                  {columns.map((column) =>
                                    column.visibility && column.label === 'action' ? (
                                      <TableCell
                                        align="left"
                                        width="10px"
                                        className={styles.tableCell}
                                        key={`language-table-cell-${column.key}-${row.id}`}
                                      >
                                        <Action
                                          id={row.id}
                                          handlePopupUpdateLanguage={handlePopupUpdateLanguage}
                                          label={languageLabel}
                                        />
                                      </TableCell>
                                    ) : column.visibility && column.label === 'isActive' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`language-table-cell-${column.key}-${row.id}`}
                                      >
                                        <ToggleActive
                                          id={row.id}
                                          isActive={row[column.label]}
                                          setPopUpConfirm={setPopUpConfirm}
                                          setCurrentIdLanguage={setCurrentIdLanguage}
                                          setCurrentStatusLanguage={setCurrentStatusLanguage}
                                        />
                                      </TableCell>
                                    ) : column.visibility && column.label === 'icon' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`language-table-cell-${column.key}-${row.id}`}
                                      >
                                        <img src={row[column.label]} alt={row.name} width={30} height={30} />
                                      </TableCell>
                                    ) : (
                                      column.visibility && (
                                        <TableCell
                                          align="left"
                                          className={styles.tableCell}
                                          key={`language-table-cell-${column.key}-${row.id}`}
                                        >
                                          {row[column.label]}
                                        </TableCell>
                                      )
                                    )
                                  )}
                                </TableRow>
                              ))}
                            </TableBody>
                          )}
                        </Table>
                      </TableContainer>
                      {dataOnPage && dataOnPage.length > 0 ? (
                        <TableFooter
                          totalItems={totalPage}
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
                </Portlet.Body>
              </Portlet>
            </Col>
          </Row>
        ) : (
          <Typography align="center" className={styles.noData}>
            There are no labels to display
          </Typography>
        )}
        <ModalSwitchLanguage
          popUpConfirm={popUpConfirm}
          setPopUpConfirm={setPopUpConfirm}
          currentStatusLanguage={currentStatusLanguage}
          currentIdLanguage={currentIdLanguage}
          setIsReloadData={setIsReloadData}
          isReloadData={isReloadData}
          isActive={!currentStatusLanguage}
        />
        {popupUpdateLanguage && (
          <UpdateLanguageModal
            id={selectedLanguage}
            title="Update Language"
            onClose={() => setPopupUpdateLanguage(false)}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
            setPopupUpdateLanguage={setPopupUpdateLanguage}
            readOnly={!isEdit}
          />
        )}
      </Container>
    </Fragment>
  );
};

export default withAuth(withLayout(() => <TableWithConfig CodeTable={codeTable} PageView={ListLanguagesPage} />));
