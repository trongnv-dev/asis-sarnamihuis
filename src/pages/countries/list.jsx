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
import { COUNTRY_COLUMN } from 'config/data-table-column';
import Head from 'next/head';
import React, { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useDispatch } from 'react-redux';
import { countryApi, commonApi } from 'services';
import { pageChangeHeaderTitle, setLabel } from 'store/actions';
import styles from 'styles/pages/country-list.module.scss';
import { sortData, colTableConfig } from 'utils/';
import { getCountryList } from 'utils/label/';
import {
  Action,
  CreateCountryModal,
  ModalDeleteCountry,
  ModalSwitchCountry,
  ToggleActive,
  UpdateCountryModal,
} from '../../components/UI/Country/CountryList';
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
import ListRegionsPage from '../regions/list';
import { REGION_LEVEL } from '../../const/message_table';

const codeTable = 'country.index';

const ListCountriesPage = (props) => {
  const { userConfig } = props;

  const router = useRouter();

  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataOnPage, setDataOnPage] = React.useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isReloadData, setIsReloadData] = useState(false);
  const [columns, setColumns] = useState(COUNTRY_COLUMN);
  const [isEdit, setIsEdit] = useState(false);

  const [popUpConfirm, setPopUpConfirm] = useState(false);
  const [popUpConfirmDelete, setPopUpConfirmDelete] = useState(false);
  const [currentStatusCountry, setCurrentStatusCountry] = useState(false);
  const [currentIdCountry, setCurrentIdCountry] = useState(null);
  const [popupUpdateCountry, setPopupUpdateCountry] = useState(false);
  const [popupCreateCountry, setPopupCreateCountry] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryName, setSelectedCountryName] = useState(null);
  const [showListRegion, setShowListRegion] = useState(false);

  const [page, setPage] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('');
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [totalPage, setTotalPage] = useState(0);

  const [textSearch, setTextSearch] = useState('');
  const [colTableSearch, setColTableSearch] = useState([
    { name: 'id', value: '', key: 'id', isDisplay: false },
    { name: 'country', value: '', key: 'country', isDisplay: false },
  ]);

  const [typeFilter, setTypeFilter] = useState('and');
  const dispatch = useDispatch();
  const [dataLabel, setDataLabel] = useState([]);
  const [countryLabel, setCountryLabel] = useState({});
  const divRef = useRef(null);

  const handlePopupUpdateCountry = (idCountry, isUpdate) => {
    if (isUpdate) {
      router.push(`/countries/update/${idCountry}`);
    } else {
      router.push(`/countries/${idCountry}`);
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

  const handlePopupDeleteCountry = (idCountry) => {
    setPopUpConfirmDelete(true);
    setSelectedCountry(idCountry);
  };

  const handleShowlistRegion = (idCountry, countryName) => {
    setSelectedCountry(idCountry);
    setSelectedCountryName(countryName);
    setShowListRegion(true);
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePopupCreateCountry = (idCountry) => {
    router.push(`/countries/create`);
  };

  useEffect(() => {
    const rs = sortData(orderBy, order, dataTable);
    setDataTable(rs);
  }, [order, orderBy]);

  useEffect(() => {
    if (dataLabel && dataLabel.length > 0) {
      const countryLabel = getCountryList(dataLabel);
      dispatch(pageChangeHeaderTitle(countryLabel.titlePage));
      dispatch(setLabel({ label: countryLabel }));
      setCountryLabel(countryLabel);
    }
  }, [dataLabel]);

  useEffect(() => {
    setPageLoading(true);
    async function getCountryLabel() {
      try {
        let response = await countryApi.getCountryLabel();
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
    getCountryLabel();
  }, []);

  useEffect(() => {
    async function fetchLanguageList() {
      setTableLoading(true);
      try {
        let response = await countryApi.getCountryList({
          orderBy: orderBy,
          direction: order,
          perPage: rowsPerPage,
          page: page,
          searchAll: textSearch,
          id: colTableSearch.find((item) => item.key === 'id').value,
          country: colTableSearch.find((item) => item.key === 'country').value,
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
      let response = await countryApi.getCountryList({
        orderBy: orderBy,
        direction: order,
        perPage: '',
        page: page,
        searchAll: isSearchAll ? '' : textSearch,
        id: colTableSearch.find((item) => item.key === 'id').value,
        country: colTableSearch.find((item) => item.key === 'country').value,
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
          { name: 'country', value: '', key: 'country', isDisplay: userConfig.column_config.country },
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
      { name: 'country', value: '', key: 'country', isDisplay: userConfig.column_config.country },
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
                    <CreateModal label={countryLabel} onClick={handlePopupCreateCountry} />
                    <ButtonPermission
                      component={ToggleEditLabel}
                      permission={true}
                      label={countryLabel.tooltipSwitch}
                    />
                    <ButtonPermission
                      component={ImportData}
                      permission={countryLabel.btnImport?.isPermission}
                      label={countryLabel}
                      disableBtn={true}
                    />
                    <ButtonPermission
                      component={ExportData}
                      permission={countryLabel.btnExport?.isPermission}
                      label={countryLabel}
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
                      label={countryLabel.tooltipSearch}
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
                      label={countryLabel.tooltipFilter}
                      typeFilter={typeFilter}
                      setTypeFilter={setTypeFilter}
                      handleSearchAndFilter={handleSearchAndFilter}
                    />
                    <ButtonPermission
                      component={ToggleVisibilityColTable}
                      permission={true}
                      columns={columns}
                      setColumns={setColumns}
                      languageLabel={countryLabel}
                      codeTable={codeTable}
                      userConfig={userConfig}
                      label={countryLabel.tooltipShowHideColumn}
                    />
                  </div>
                </Portlet.Header>
                <Portlet.Body>
                  {tableLoading ? (
                    <div className={styles.loading}>
                      <CircularProgress disableShrink />
                    </div>
                  ) : (
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
                              languageLabel={countryLabel}
                            />
                            <TableBody>
                              {dataOnPage.map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={`country-${row.id}`}>
                                  {columns.map((column) =>
                                    column.visibility && column.label === 'action' ? (
                                      <TableCell
                                        align="left"
                                        width="10px"
                                        className={styles.tableCell}
                                        key={`country-table-cell-${column.key}-${row.id}`}
                                      >
                                        <Action
                                          id={row.id}
                                          handlePopupUpdateCountry={handlePopupUpdateCountry}
                                          handlePopupDeleteCountry={handlePopupDeleteCountry}
                                          countryName={row.country}
                                          handleShowlistRegion={handleShowlistRegion}
                                          label={countryLabel}
                                        />
                                      </TableCell>
                                    ) : column.visibility && column.label === 'isActive' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`country-table-cell-${column.key}-${row.id}`}
                                      >
                                        <ToggleActive
                                          id={row.id}
                                          isActive={row[column.label]}
                                          setPopUpConfirm={setPopUpConfirm}
                                          setCurrentIdCountry={setCurrentIdCountry}
                                          setCurrentStatusCountry={setCurrentStatusCountry}
                                        />
                                      </TableCell>
                                    ) : column.visibility && column.key === 'icon' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`country-table-cell-${column.key}-${row.id}`}
                                      >
                                        <img src={row[column.label]} alt={row.name} width={30} height={30} />
                                      </TableCell>
                                    ) : (
                                      column.visibility && (
                                        <TableCell
                                          align="left"
                                          className={styles.tableCell}
                                          key={`country-table-cell-${column.key}-${row.id}`}
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
        <ModalSwitchCountry
          popUpConfirm={popUpConfirm}
          setPopUpConfirm={setPopUpConfirm}
          currentIdCountry={currentIdCountry}
          setIsReloadData={setIsReloadData}
          isReloadData={isReloadData}
          isActive={!currentStatusCountry}
        />
        {popupUpdateCountry && (
          <UpdateCountryModal
            id={selectedCountry}
            title="Update Country"
            onClose={() => setPopupUpdateCountry(false)}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
            setPopupUpdateCountry={setPopupUpdateCountry}
            readOnly={!isEdit}
          />
        )}
        {popUpConfirmDelete && (
          <ModalDeleteCountry
            popUpConfirm={popUpConfirmDelete}
            setPopUpConfirm={setPopUpConfirmDelete}
            currentIdCountry={selectedCountry}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
          />
        )}
        {popupCreateCountry && (
          <CreateCountryModal
            title="Create Country"
            onClose={() => setPopupCreateCountry(false)}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
            setPopupCreateCountry={setPopupCreateCountry}
          />
        )}
        <div ref={divRef}>{showListRegion && <RegionTable />}</div>
      </Container>
    </Fragment>
  );

  function RegionTable() {
    return (
      <div>
        <h4>
          {REGION_LEVEL[0]} {selectedCountryName}
        </h4>
        <ListRegionsPage countryId={selectedCountry} parentId={0} tabIndex={0}></ListRegionsPage>
      </div>
    );
  }
};

export default withAuth(withLayout(() => <TableWithConfig CodeTable={codeTable} PageView={ListCountriesPage} />));
