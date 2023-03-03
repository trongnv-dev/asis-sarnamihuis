import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
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
import { GENDER_COLUMN } from 'config/data-table-column';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import { genderApi, commonApi } from 'services';
import { pageChangeHeaderTitle, setLabel } from 'store/actions';
import styles from 'styles/pages/gender-list.module.scss';
import { sortData, colTableConfig } from 'utils/';
import { getGenderList } from 'utils/label/';

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
  CreateGenderModal,
  ModalDeleteGender,
  ModalSwitchGender,
  ToggleActive,
  UpdateGenderModal,
} from '../../components/UI/Gender/GenderList';
const codeTable = 'gender.index';
const ListGendersPage = (props) => {
  const { userConfig } = props;

  const router = useRouter();

  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataOnPage, setDataOnPage] = React.useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isReloadData, setIsReloadData] = useState(false);
  const [columns, setColumns] = useState(GENDER_COLUMN);
  const [isEdit, setIsEdit] = useState(false);

  const [popUpConfirm, setPopUpConfirm] = useState(false);
  const [popUpConfirmDelete, setPopUpConfirmDelete] = useState(false);
  const [currentStatusGender, setCurrentStatusGender] = useState(false);
  const [currentIdGender, setCurrentIdGender] = useState(null);
  const [popupUpdateGender, setPopupUpdateGender] = useState(false);
  const [popupCreateGender, setPopupCreateGender] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [codeTable, setCodeTable] = useState('gender.index');

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

  const [typeFilter, setTypeFilter] = useState('and');
  const dispatch = useDispatch();
  const [dataLabel, setDataLabel] = useState([]);
  const [genderLabel, setGenderLabel] = useState({});

  const handlePopupUpdateGender = (idGender, isUpdate) => {
    if (isUpdate) {
      router.push(`/genders/update/${idGender}`);
    } else {
      router.push(`/genders/${idGender}`);
    }
  };

  const handlePopupDeleteGender = (idGender) => {
    setPopUpConfirmDelete(true);
    setSelectedGender(idGender);
  };

  const handlePopupCreateGender = (idGender) => {
    router.push(`/genders/create`);
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
      const genderLabel = getGenderList(dataLabel);
      dispatch(pageChangeHeaderTitle(genderLabel.titlePage));
      dispatch(setLabel({ label: genderLabel }));
      setGenderLabel(genderLabel);
    }
  }, [dataLabel]);

  useEffect(() => {
    setPageLoading(true);
    async function getGenderLabel() {
      try {
        let response = await genderApi.getGenderLabel();
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
    getGenderLabel();
  }, []);

  useEffect(() => {
    async function fetchLanguageList() {
      setTableLoading(true);
      try {
        let response = await genderApi.getGenderList({
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
      let response = await genderApi.getGenderList({
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

  useEffect(() => {
    setColTableSearch([
      { name: 'id', value: '', key: 'id', isDisplay: userConfig.column_config.column_id },
      { name: 'name', value: '', key: 'name', isDisplay: userConfig.column_config.column_name },
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
                    <CreateModal label={genderLabel} onClick={handlePopupCreateGender} />
                    <ButtonPermission component={ToggleEditLabel} permission={true} label={genderLabel.tooltipSwitch} />
                    <ButtonPermission
                      component={ImportData}
                      permission={genderLabel.btnImport?.isPermission}
                      label={genderLabel}
                      disableBtn={true}
                    />
                    <ButtonPermission
                      component={ExportData}
                      permission={genderLabel.btnExport?.isPermission}
                      label={genderLabel}
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
                      label={genderLabel.tooltipSearch}
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
                      label={genderLabel.tooltipFilter}
                      typeFilter={typeFilter}
                      setTypeFilter={setTypeFilter}
                      handleSearchAndFilter={handleSearchAndFilter}
                    />
                    <ButtonPermission
                      component={ToggleVisibilityColTable}
                      permission={true}
                      columns={columns}
                      setColumns={setColumns}
                      languageLabel={genderLabel}
                      codeTable={codeTable}
                      userConfig={userConfig}
                      label={genderLabel.tooltipShowHideColumn}
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
                            languageLabel={genderLabel}
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
                                <TableRow hover role="checkbox" tabIndex={-1} key={`gender-${row.id}`}>
                                  {columns.map((column) =>
                                    column.visibility && column.label === 'action' ? (
                                      <TableCell
                                        align="left"
                                        width="10px"
                                        className={styles.tableCell}
                                        key={`gender-table-cell-${column.key}-${row.id}`}
                                      >
                                        <Action
                                          id={row.id}
                                          handlePopupUpdateGender={handlePopupUpdateGender}
                                          handlePopupDeleteGender={handlePopupDeleteGender}
                                          label={genderLabel}
                                        />
                                      </TableCell>
                                    ) : column.visibility && column.label === 'isActive' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`gender-table-cell-${column.key}-${row.id}`}
                                      >
                                        <ToggleActive
                                          id={row.id}
                                          isActive={row[column.label]}
                                          setPopUpConfirm={setPopUpConfirm}
                                          setCurrentIdGender={setCurrentIdGender}
                                          setCurrentStatusGender={setCurrentStatusGender}
                                        />
                                      </TableCell>
                                    ) : column.visibility && column.label === 'icon' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`gender-table-cell-${column.key}-${row.id}`}
                                      >
                                        <img src={row[column.label]} alt={row.name} width={30} height={30} />
                                      </TableCell>
                                    ) : (
                                      column.visibility && (
                                        <TableCell
                                          align="left"
                                          className={styles.tableCell}
                                          key={`gender-table-cell-${column.key}-${row.id}`}
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
        <ModalSwitchGender
          popUpConfirm={popUpConfirm}
          setPopUpConfirm={setPopUpConfirm}
          currentIdGender={currentIdGender}
          setIsReloadData={setIsReloadData}
          setPopUpConfirmDelete
          isReloadData={isReloadData}
          isActive={!currentStatusGender}
        />
        {popupUpdateGender && (
          <UpdateGenderModal
            id={selectedGender}
            title="Update Gender"
            onClose={() => setPopupUpdateGender(false)}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
            setPopupUpdateGender={setPopupUpdateGender}
            readOnly={!isEdit}
          />
        )}
        {popUpConfirmDelete && (
          <ModalDeleteGender
            popUpConfirm={popUpConfirmDelete}
            setPopUpConfirm={setPopUpConfirmDelete}
            currentIdGender={selectedGender}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
          />
        )}
        {popupCreateGender && (
          <CreateGenderModal
            title="Create Gender"
            onClose={() => setPopupCreateGender(false)}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
            setPopupCreateGender={setPopupCreateGender}
          />
        )}
      </Container>
    </Fragment>
  );
};

export default withAuth(withLayout(() => <TableWithConfig CodeTable={codeTable} PageView={ListGendersPage} />));
