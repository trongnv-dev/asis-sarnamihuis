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
import { SYS_ATT_MAIN_COLUMN } from 'config/data-table-column';
import Head from 'next/head';
import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { sysAttMainApi, commonApi } from 'services';
import { pageChangeHeaderTitle, setLabel } from 'store/actions';
import styles from 'styles/pages/sys-att-main-list.module.scss';
import { sortData, colTableConfig } from 'utils/';
import { getSysAttMainList } from 'utils/label/';
import ListSysAttSubsPage from './../sys-att-sub/list';
import { useRouter } from 'next/dist/client/router';

import {
  CreateModal,
  ExportData,
  ImportData,
  SearchByColumn,
  SearchByKeyword,
  TableFooter,
  TableHeader,
  ToggleEditLabel,
  ToggleVisibilityColTable,
  TableWithConfig,
  ButtonPermission,
} from '../../components/UI/features';
import {
  Action,
  ModalDeleteSysAttMain,
  ModalSwitchSysAttMain,
  ToggleActive,
} from '../../components/UI/SysAttMain/SysAttMainList';
const codeTable = 'sysAttMain.index';
const ListSysAttMainsPage = (props) => {
  const { userConfig } = props;
  const router = useRouter();

  const [dataTable, setDataTable] = useState([]);
  const [dataOnPage, setDataOnPage] = React.useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isReloadData, setIsReloadData] = useState(false);
  const [columns, setColumns] = useState(SYS_ATT_MAIN_COLUMN);

  const [popUpConfirm, setPopUpConfirm] = useState(false);
  const [popUpConfirmDelete, setPopUpConfirmDelete] = useState(false);
  const [currentStatusSysAttMain, setCurrentStatusSysAttMain] = useState(false);
  const [currentIdSysAttMain, setCurrentIdSysAttMain] = useState(null);
  const [selectedSysAttMain, setSelectedSysAttMain] = useState(null);
  const [codeTable, setCodeTable] = useState('sysAttMain.index');
  const [showSysAttSub, setShowSysAttSub] = useState(false);
  const [selectedSysAttMainName, setSelectedSysAttMainName] = useState(null);

  const [page, setPage] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('');
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [totalPage, setTotalPage] = useState(0);

  const [textSearch, setTextSearch] = useState('');
  const [colTableSearch, setColTableSearch] = useState([
    { name: 'id', value: '', key: 'id', isDisplay: false },
    { name: 'name', value: '', key: 'name', isDisplay: false },
  ]);

  const dispatch = useDispatch();
  const [dataLabel, setDataLabel] = useState([]);
  const [sysAttMainLabel, setSysAttMainLabel] = useState({});
  const [typeFilter, setTypeFilter] = useState('and');

  const handlePopupUpdateSysAttMain = (idSysAttMain, isUpdate) => {
    if (!isUpdate) {
      router.push(`/sys-att-main/${idSysAttMain}`);
    } else {
      router.push(`/sys-att-main/update/${idSysAttMain}`);
    }
  };

  const handlePopupDeleteSysAttMain = (idSysAttMain) => {
    setPopUpConfirmDelete(true);
    setSelectedSysAttMain(idSysAttMain);
    setShowSysAttSub(false);
  };

  const handlePopupCreateSysAttMain = (idSysAttMain) => {
    router.push(`/sys-att-main/create`);
  };

  const handleShowSysAttSub = (idSysAttMain, sysAttMainName) => {
    setSelectedSysAttMain(idSysAttMain);
    setSelectedSysAttMainName(sysAttMainName);
    setShowSysAttSub(true);
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

  useEffect(() => {
    const rs = sortData(orderBy, order, dataTable);
    setDataTable(rs);
  }, [order, orderBy]);

  useEffect(() => {
    if (dataLabel && dataLabel.length > 0) {
      const sysAttMainLabel = getSysAttMainList(dataLabel);
      dispatch(pageChangeHeaderTitle(sysAttMainLabel.titlePage));
      dispatch(setLabel({ label: sysAttMainLabel }));
      setSysAttMainLabel(sysAttMainLabel);
    }
  }, [dataLabel]);

  useEffect(() => {
    setPageLoading(true);
    async function getSysAttMainLabel() {
      try {
        let response = await sysAttMainApi.getSysAttMainLabel();
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
    getSysAttMainLabel();
  }, []);

  useEffect(() => {
    async function fetchLanguageList() {
      setTableLoading(true);
      try {
        let response = await sysAttMainApi.getSysAttMainList({
          orderBy: orderBy,
          direction: order,
          perPage: rowsPerPage,
          page: page,
          searchAll: textSearch,
          id: colTableSearch.find((item) => item.key === 'id').value,
          name: colTableSearch.find((item) => item.key === 'name').value,
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

  const getDataExport = async (isSearchAll) => {
    try {
      let response = await sysAttMainApi.getSysAttMainList({
        orderBy: orderBy,
        direction: order,
        perPage: '',
        page: page,
        searchAll: isSearchAll ? '' : textSearch,
        id: colTableSearch.find((item) => item.key === 'id').value,
        name: colTableSearch.find((item) => item.key === 'name').value,
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
    setColTableSearch([
      { name: 'id', value: '', key: 'id', isDisplay: userConfig.column_config.column_id },
      { name: 'name', value: '', key: 'name', isDisplay: userConfig.column_config.column_name },
    ]);
  }, [userConfig]);

  const handleSearchAndFilter = useCallback(
    (type) => {
      if (type === 'clear') {
        setColTableSearch([
          { name: 'id', value: '', key: 'id', isDisplay: userConfig.column_config.column_id },
          { name: 'name', value: '', key: 'name', isDisplay: userConfig.column_config.column_name },
        ]);
        setTypeFilter('and');
      }
      setPage(1);
      setRowsPerPage(10);
      setIsReloadData(!isReloadData);
    },
    [isReloadData]
  );
  //===============================================================
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
                    <CreateModal label={sysAttMainLabel} onClick={handlePopupCreateSysAttMain} />
                    <ButtonPermission component={ToggleEditLabel} permission={true} label={sysAttMainLabel.tooltipSwitch} />
                    <ButtonPermission
                      component={ImportData}
                      permission={sysAttMainLabel.btnImport?.isPermission}
                      label={sysAttMainLabel}
                      disableBtn={true}
                    />
                    <ButtonPermission
                      component={ExportData}
                      permission={sysAttMainLabel.btnExport?.isPermission}
                      label={sysAttMainLabel}
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
                      label={sysAttMainLabel.tooltipSearch}
                    />
                    <ButtonPermission
                      component={SearchByColumn}
                      permission={true}
                      colTableSearch={colTableSearch}
                      setColTableSearch={setColTableSearch}
                      isReloadData={isReloadData}
                      setIsReloadData={setIsReloadData}
                      setPage={setPage}
                      setRowsPerPage={setRowsPerPage}
                      label={sysAttMainLabel.tooltipFilter}
                      typeFilter={typeFilter}
                      setTypeFilter={setTypeFilter}
                      handleSearchAndFilter={handleSearchAndFilter}
                    />
                    <ButtonPermission
                      component={ToggleVisibilityColTable}
                      permission={true}
                      columns={columns}
                      setColumns={setColumns}
                      languageLabel={sysAttMainLabel}
                      codeTable={codeTable}
                      userConfig={userConfig}
                      label={sysAttMainLabel.tooltipShowHideColumn}
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
                            languageLabel={sysAttMainLabel}
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
                                <TableRow hover role="checkbox" tabIndex={-1} key={`sysAttMain-${row.id}`}>
                                  {columns.map((column) =>
                                    column.visibility && column.label === 'action' ? (
                                      <TableCell
                                        align="left"
                                        width="10px"
                                        className={styles.tableCell}
                                        key={`sysAttMain-table-cell-${column.key}-${row.id}`}
                                      >
                                        <Action
                                          id={row.id}
                                          handlePopupUpdateSysAttMain={handlePopupUpdateSysAttMain}
                                          handlePopupDeleteSysAttMain={handlePopupDeleteSysAttMain}
                                          handleShowSysAttSub={handleShowSysAttSub}
                                          sysAttMainName={row.name}
                                          label={sysAttMainLabel}
                                        />
                                      </TableCell>
                                    ) : column.visibility && column.label === 'isActive' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`sysAttMain-table-cell-${column.key}-${row.id}`}
                                      >
                                        <ToggleActive
                                          id={row.id}
                                          isActive={row[column.label]}
                                          setPopUpConfirm={setPopUpConfirm}
                                          setCurrentIdSysAttMain={setCurrentIdSysAttMain}
                                          setCurrentStatusSysAttMain={setCurrentStatusSysAttMain}
                                        />
                                      </TableCell>
                                    ) : column.visibility && column.label === 'icon' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`sysAttMain-table-cell-${column.key}-${row.id}`}
                                      >
                                        <img src={row[column.label]} alt={row.name} width={30} height={30} />
                                      </TableCell>
                                    ) : (
                                      column.visibility && (
                                        <TableCell
                                          align="left"
                                          className={styles.tableCell}
                                          key={`sysAttMain-table-cell-${column.key}-${row.id}`}
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
        <ModalSwitchSysAttMain
          popUpConfirm={popUpConfirm}
          setPopUpConfirm={setPopUpConfirm}
          currentIdSysAttMain={currentIdSysAttMain}
          setIsReloadData={setIsReloadData}
          setPopUpConfirmDelete
          isReloadData={isReloadData}
          isActive={!currentStatusSysAttMain}
        />
        {popUpConfirmDelete && (
          <ModalDeleteSysAttMain
            popUpConfirm={popUpConfirmDelete}
            setPopUpConfirm={setPopUpConfirmDelete}
            currentIdSysAttMain={selectedSysAttMain}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
          />
        )}
        {showSysAttSub && <SysAttSubTable />}
      </Container>
    </Fragment>
  );

  function SysAttSubTable() {
    return (
      <div>
        <h4>
          {selectedSysAttMainName}
        </h4>
        <ListSysAttSubsPage idAttMain={selectedSysAttMain}></ListSysAttSubsPage>
      </div>
    );
  }

};

export default withAuth(withLayout(() => <TableWithConfig CodeTable={codeTable} PageView={ListSysAttMainsPage} />));
