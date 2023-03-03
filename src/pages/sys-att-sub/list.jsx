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
import { SYS_ATT_SUB_COLUMN } from 'config/data-table-column';
import Head from 'next/head';
import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { sysAttSubApi, commonApi } from 'services';
import { pageChangeHeaderTitle, setLabel } from 'store/actions';
import styles from 'styles/pages/sys-att-sub-list.module.scss';
import { sortData, colTableConfig } from 'utils/';
import { getSysAttSubList } from 'utils/label/';
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
  ModalDeleteSysAttSub,
  ModalSwitchSysAttSub,
  ToggleActive,
} from '../../components/UI/SysAttSub/SysAttSubList';
const codeTable = 'sysAttSub.index';
const ListSysAttSubsPage = (props) => {
  const { idAttMain } = props;
  const router = useRouter();
  const [userConfig, setUserConfig] = useState(null);
  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataOnPage, setDataOnPage] = React.useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isReloadData, setIsReloadData] = useState(false);
  const [columns, setColumns] = useState(SYS_ATT_SUB_COLUMN);
  const [isEdit, setIsEdit] = useState(false);

  const [popUpConfirm, setPopUpConfirm] = useState(false);
  const [popUpConfirmDelete, setPopUpConfirmDelete] = useState(false);
  const [currentStatusSysAttSub, setCurrentStatusSysAttSub] = useState(false);
  const [currentIdSysAttSub, setCurrentIdSysAttSub] = useState(null);
  const [selectedSysAttSub, setSelectedSysAttSub] = useState(null);
  const [codeTable, setCodeTable] = useState('sysAttSub.index');

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
  const [sysAttSubLabel, setSysAttSubLabel] = useState({});
  const [typeFilter, setTypeFilter] = useState('and');

  const handlePopupUpdateSysAttSub = (idSysAttSub, isUpdate) => {
    if (!isUpdate) {
      router.push(`/sys-att-sub/${idSysAttSub}`);
    } else {
      router.push(`/sys-att-sub/update?id=${idSysAttSub}&sysAttMainId=${idAttMain}`)
    }
  };

  const handlePopupDeleteSysAttSub = (idSysAttSub) => {
    setPopUpConfirmDelete(true);
    setSelectedSysAttSub(idSysAttSub);
  };

  const handlePopupCreateSysAttSub = () => {
    router.push(`/sys-att-sub/create/${idAttMain}`)
  };

  useEffect(() => {
    async function getUserConfig() {
      try {
        let response = await commonApi.userConfig({ CodeTable: codeTable });
        if (response.status === 200) {
          const config = JSON.parse(response.data.data.value);
          if (config == null || config.column_config == null || config.page == null || config.per_page == null) {
            const data_sample = {
              column_config: {
                column_id: true,
                column_action: true,
              },
              page: 1,
              per_page: 10,
            };
            await commonApi.colTableConfig({
              code: codeTable,
              value: data_sample,
            });
            setUserConfig(data_sample);
          } else {
            setUserConfig(JSON.parse(response.data.data.value));
          }
        } else {
          console.log(error.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    getUserConfig();
  }, []);

  useEffect(() => {
    if (userConfig == null) return;
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
    const rs = sortData(orderBy, order, dataTable);
    setDataTable(rs);
  }, [order, orderBy]);

  useEffect(() => {
    if (dataLabel && dataLabel.length > 0) {
      const sysAttSubLabel = getSysAttSubList(dataLabel);
      dispatch(pageChangeHeaderTitle(sysAttSubLabel.titlePage));
      dispatch(setLabel({ label: sysAttSubLabel }));
      setSysAttSubLabel(sysAttSubLabel);
    }
  }, [dataLabel]);

  useEffect(() => {
    setPageLoading(true);
    async function getSysAttSubLabel() {
      try {
        let response = await sysAttSubApi.getSysAttSubLabel();
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
    getSysAttSubLabel();
  }, []);

  useEffect(() => {
    async function fetchLanguageList() {
      setTableLoading(true);
      try {
        let response = await sysAttSubApi.getSysAttSubList({
          orderBy: orderBy,
          direction: order,
          perPage: rowsPerPage,
          page: page,
          searchAll: textSearch,
          id: colTableSearch.find((item) => item.key === 'id').value,
          name: colTableSearch.find((item) => item.key === 'name').value,
          idAttMain: idAttMain,
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
    if (!page && !rowsPerPage) {
      return
    };
    fetchLanguageList();
  }, [isReloadData, page, rowsPerPage, order, orderBy]);

  const getDataExport = async (isSearchAll) => {
    try {
      let response = await sysAttSubApi.getSysAttSubList({
        orderBy: orderBy,
        direction: order,
        perPage: '',
        page: page,
        searchAll: isSearchAll ? '' : textSearch,
        id: colTableSearch.find((item) => item.key === 'id').value,
        name: colTableSearch.find((item) => item.key === 'name').value,
        idAttMain: idAttMain,
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
    if (userConfig != null)
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
                    <CreateModal label={sysAttSubLabel} onClick={handlePopupCreateSysAttSub} />
                    <ButtonPermission component={ToggleEditLabel} permission={true} label={sysAttSubLabel.tooltipSwitch} />
                    <ButtonPermission
                      component={ImportData}
                      permission={sysAttSubLabel.btnImport?.isPermission}
                      label={sysAttSubLabel}
                      disableBtn={true}
                    />
                    <ButtonPermission
                      component={ExportData}
                      permission={sysAttSubLabel.btnExport?.isPermission}
                      label={sysAttSubLabel}
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
                      label={sysAttSubLabel.tooltipSearch}
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
                      label={sysAttSubLabel.tooltipFilter}
                      typeFilter={typeFilter}
                      setTypeFilter={setTypeFilter}
                      handleSearchAndFilter={handleSearchAndFilter}
                    />
                    <ButtonPermission
                      component={ToggleVisibilityColTable}
                      permission={true}
                      columns={columns}
                      setColumns={setColumns}
                      languageLabel={sysAttSubLabel}
                      codeTable={codeTable}
                      userConfig={userConfig}
                      label={sysAttSubLabel.tooltipShowHideColumn}
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
                            languageLabel={sysAttSubLabel}
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
                                <TableRow hover role="checkbox" tabIndex={-1} key={`sysAttSub-${row.id}`}>
                                  {columns.map((column) =>
                                    column.visibility && column.label === 'action' ? (
                                      <TableCell
                                        align="left"
                                        width="10px"
                                        className={styles.tableCell}
                                        key={`sysAttSub-table-cell-${column.key}-${row.id}`}
                                      >
                                        <Action
                                          id={row.id}
                                          handlePopupUpdateSysAttSub={handlePopupUpdateSysAttSub}
                                          handlePopupDeleteSysAttSub={handlePopupDeleteSysAttSub}
                                          label={sysAttSubLabel}
                                        />
                                      </TableCell>
                                    ) : column.visibility && column.label === 'isActive' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`sysAttSub-table-cell-${column.key}-${row.id}`}
                                      >
                                        <ToggleActive
                                          id={row.id}
                                          isActive={row[column.label]}
                                          setPopUpConfirm={setPopUpConfirm}
                                          setCurrentIdSysAttSub={setCurrentIdSysAttSub}
                                          setCurrentStatusSysAttSub={setCurrentStatusSysAttSub}
                                        />
                                      </TableCell>
                                    ) : column.visibility && column.label === 'icon' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`sysAttSub-table-cell-${column.key}-${row.id}`}
                                      >
                                        <img src={row[column.label]} alt={row.name} width={30} height={30} />
                                      </TableCell>
                                    ) : (
                                      column.visibility && (
                                        <TableCell
                                          align="left"
                                          className={styles.tableCell}
                                          key={`sysAttSub-table-cell-${column.key}-${row.id}`}
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
        <ModalSwitchSysAttSub
          popUpConfirm={popUpConfirm}
          setPopUpConfirm={setPopUpConfirm}
          currentIdSysAttSub={currentIdSysAttSub}
          setIsReloadData={setIsReloadData}
          setPopUpConfirmDelete
          isReloadData={isReloadData}
          isActive={!currentStatusSysAttSub}
        />
        {popUpConfirmDelete && (
          <ModalDeleteSysAttSub
            popUpConfirm={popUpConfirmDelete}
            setPopUpConfirm={setPopUpConfirmDelete}
            currentIdSysAttSub={selectedSysAttSub}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
          />
        )}
      </Container>
    </Fragment>
  );
};

// export default withAuth(withLayout(() => <TableWithConfig CodeTable={codeTable} PageView={ListSysAttSubsPage} />));
// export default withAuth(withLayout(ListSysAttSubsPage));
export default withLayout(ListSysAttSubsPage);
