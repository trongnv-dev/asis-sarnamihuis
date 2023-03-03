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
import { swal } from 'components/swal/instance';
import { REGION_COLUMN } from 'config/data-table-column';
import React, { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { commonApi, regionApi } from 'services';
import { pageChangeHeaderTitle, setLabel } from 'store/actions';
import styles from 'styles/pages/region-list.module.scss';
import { colTableConfig, sortData } from 'utils';
import { getRegionList } from 'utils/label';
import {
  ButtonPermission,
  CreateModal,
  ExportData,
  ImportData,
  SearchByColumn,
  SearchByKeyword,
  TableFooter,
  TableHeader,
  ToggleEditLabel,
  ToggleVisibilityColTable,
} from '../../components/UI/features';
import {
  Action,
  CreateRegionModal,
  ModalDeleteRegion,
  ModalSwitchRegion,
  ToggleActive,
  UpdateRegionModal,
} from '../../components/UI/Region/RegionList';
import { REGION_LEVEL } from '../../const/message_table';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
const codeTable = 'region.index';

const ListRegionsPage = (props) => {
  const [userConfig, setUserConfig] = useState(null);
  const { countryId, parentId, tabIndex } = props;
  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataOnPage, setDataOnPage] = React.useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isReloadData, setIsReloadData] = useState(false);
  const [columns, setColumns] = useState(REGION_COLUMN);
  const [isEdit, setIsEdit] = useState(false);

  const [popUpConfirm, setPopUpConfirm] = useState(false);
  const [popUpConfirmDelete, setPopUpConfirmDelete] = useState(false);
  const [currentStatusRegion, setCurrentStatusRegion] = useState(false);
  const [currentIdRegion, setCurrentIdRegion] = useState(null);
  const [popupUpdateRegion, setPopupUpdateRegion] = useState(false);
  const [popupCreateRegion, setPopupCreateRegion] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedRegionName, setSelectedRegionName] = useState(null);
  const [showChildRegion, setShowChildRegion] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [totalPage, setTotalPage] = useState(0);
  const divRef = useRef(null);
  const [createWithoutTooltip, setCreateWithoutTooltip] = useState(true);

  const [textSearch, setTextSearch] = useState('');
  const [colTableSearch, setColTableSearch] = useState([
    { name: 'id', value: '', key: 'id', isDisplay: false },
    { name: 'region', value: '', key: 'region', isDisplay: false },
  ]);

  const [typeFilter, setTypeFilter] = useState('and');
  const dispatch = useDispatch();
  const [dataLabel, setDataLabel] = useState([]);
  const [regionLabel, setRegionLabel] = useState({});

  const handlePopupUpdateRegion = (idRegion, parentId, isUpdate) => {
    if (isUpdate) {
      window.open(`${window.location.origin}/regions/update/${idRegion}`, '_blank');
    } else {
      window.open(`${window.location.origin}/regions/${idRegion}`, '_blank');
    }
  };

  useEffect(() => {
    async function getUserConfig() {
      try {
        let response = await commonApi.userConfig({ CodeTable: countryId + parentId + codeTable });
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
              code: countryId + parentId + codeTable,
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
  }, [userConfig]);

  const handlePopupDeleteRegion = (idRegion) => {
    setPopUpConfirmDelete(true);
    setSelectedRegion(idRegion);
  };

  const handlePopupCreateRegion = (idRegion = 0, createWithoutTooltip = true) => {
    window.open(`${window.location.origin}/regions/create`, '_blank');
  };

  const handleShowChildRegion = (idRegion = 0, regionName) => {
    setSelectedRegion(idRegion);
    setSelectedRegionName(regionName);
    setShowChildRegion(true);
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const rs = sortData(orderBy, order, dataTable);
    setDataTable(rs);
  }, [order, orderBy]);

  useEffect(() => {
    if (dataLabel && dataLabel.length > 0) {
      const regionLabel = getRegionList(dataLabel);
      dispatch(pageChangeHeaderTitle(regionLabel.titlePage));
      dispatch(setLabel({ label: regionLabel }));
      setRegionLabel(regionLabel);
    }
  }, [dataLabel]);

  useEffect(() => {
    setPageLoading(true);
    async function getRegionLabel() {
      try {
        let response = await regionApi.getRegionLabel();
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
    getRegionLabel();
  }, []);

  useEffect(() => {
    async function fetchLanguageList() {
      setTableLoading(true);
      try {
        let response = await regionApi.getRegionList({
          orderBy: orderBy,
          direction: order,
          perPage: rowsPerPage,
          page: page,
          searchAll: textSearch,
          id: colTableSearch.find((item) => item.key === 'id').value,
          region: colTableSearch.find((item) => item.key === 'region').value,
          parentId: parentId,
          idCountry: countryId,
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
  }, [isReloadData, page, rowsPerPage, order, orderBy, userConfig]);

  const getDataExport = async (isSearchAll) => {
    try {
      let response = await regionApi.getRegionList({
        orderBy: orderBy,
        direction: order,
        perPage: '',
        page: page,
        searchAll: isSearchAll ? '' : textSearch,
        id: colTableSearch.find((item) => item.key === 'id').value,
        region: colTableSearch.find((item) => item.key === 'region').value,
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
          { name: 'region', value: '', key: 'region', isDisplay: userConfig.column_config.column_region },
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
    if (userConfig != null)
      setColTableSearch([
        { name: 'id', value: '', key: 'id', isDisplay: userConfig.column_config.column_id },
        { name: 'region', value: '', key: 'region', isDisplay: userConfig.column_config.column_region },
      ]);
  }, [userConfig]);
  return (
    <Fragment>
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
                    <CreateModal label={regionLabel} onClick={handlePopupCreateRegion} />
                    <ButtonPermission
                      component={ToggleEditLabel}
                      permission={regionLabel.btnImport?.isPermission}
                      label={regionLabel.tooltipSwitch}
                    />
                    <ButtonPermission
                      component={ImportData}
                      permission={regionLabel.btnImport?.isPermission}
                      label={regionLabel}
                      disableBtn={true}
                    />
                    <ButtonPermission
                      component={ExportData}
                      permission={regionLabel.btnImport?.isPermission}
                      label={regionLabel}
                      dataOnPage={dataOnPage}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      columns={columns}
                      isPageLabel={false}
                      dataListPageExport={getDataExport}
                    />
                    <ButtonPermission
                      component={SearchByKeyword}
                      permission={regionLabel.btnImport?.isPermission}
                      textSearch={textSearch}
                      setTextSearch={setTextSearch}
                      isReloadData={isReloadData}
                      setIsReloadData={setIsReloadData}
                      setPage={setPage}
                      setRowsPerPage={setRowsPerPage}
                      label={regionLabel.tooltipSearch}
                    />
                    <ButtonPermission
                      component={SearchByColumn}
                      permission={regionLabel.btnImport?.isPermission}
                      colTableSearch={colTableSearch}
                      setColTableSearch={setColTableSearch}
                      setPage={setPage}
                      setRowsPerPage={setRowsPerPage}
                      isReloadData={isReloadData}
                      setIsReloadData={setIsReloadData}
                      label={regionLabel.tooltipFilter}
                      typeFilter={typeFilter}
                      setTypeFilter={setTypeFilter}
                      handleSearchAndFilter={handleSearchAndFilter}
                    />
                    <ButtonPermission
                      component={ToggleVisibilityColTable}
                      permission={regionLabel.btnImport?.isPermission}
                      columns={columns}
                      setColumns={setColumns}
                      languageLabel={regionLabel}
                      codeTable={countryId + parentId + codeTable}
                      userConfig={userConfig}
                      label={regionLabel.tooltipShowHideColumn}
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
                              languageLabel={regionLabel}
                            />
                            <TableBody>
                              {dataOnPage.map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={`region-${row.id}`}>
                                  {columns.map((column) =>
                                    column.visibility && column.label === 'action' ? (
                                      <TableCell
                                        align="left"
                                        width="10px"
                                        className={styles.tableCell}
                                        key={`region-table-cell-${column.key}-${row.id}`}
                                      >
                                        <Action
                                          parentId={row.parentId}
                                          id={row.id}
                                          name={row.region}
                                          handlePopupUpdateRegion={handlePopupUpdateRegion}
                                          handlePopupDeleteRegion={handlePopupDeleteRegion}
                                          handlePopupCreateRegion={handlePopupCreateRegion}
                                          handleShowChildRegion={handleShowChildRegion}
                                          label={regionLabel}
                                          isShowChild={tabIndex <= 2}
                                        />
                                      </TableCell>
                                    ) : column.visibility && column.label === 'isActive' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`region-table-cell-${column.key}-${row.id}`}
                                      >
                                        <ToggleActive
                                          id={row.id}
                                          isActive={row[column.label]}
                                          setPopUpConfirm={setPopUpConfirm}
                                          setCurrentIdRegion={setCurrentIdRegion}
                                          setCurrentStatusRegion={setCurrentStatusRegion}
                                        />
                                      </TableCell>
                                    ) : (
                                      column.visibility && (
                                        <TableCell
                                          align="left"
                                          className={styles.tableCell}
                                          key={`region-table-cell-${column.key}-${row.id}`}
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
        <ModalSwitchRegion
          popUpConfirm={popUpConfirm}
          setPopUpConfirm={setPopUpConfirm}
          currentIdRegion={currentIdRegion}
          setIsReloadData={setIsReloadData}
          isReloadData={isReloadData}
          isActive={!currentStatusRegion}
        />
        {popupUpdateRegion && (
          <UpdateRegionModal
            id={selectedRegion}
            countryId={countryId}
            parentId={selectedParentId}
            title="Update Region"
            onClose={() => setPopupUpdateRegion(false)}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
            setPopupUpdateRegion={setPopupUpdateRegion}
            readOnly={!isEdit}
          />
        )}
        {popUpConfirmDelete && (
          <ModalDeleteRegion
            popUpConfirm={popUpConfirmDelete}
            setPopUpConfirm={setPopUpConfirmDelete}
            currentIdRegion={selectedRegion}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
          />
        )}
        {popupCreateRegion && (
          <CreateRegionModal
            countryId={countryId}
            title="Create Region"
            onClose={() => setPopupCreateRegion(false)}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
            setPopupCreateRegion={setPopupCreateRegion}
            parentId={createWithoutTooltip ? parentId : selectedRegion}
          />
        )}
        <div ref={divRef}>{showChildRegion && tabIndex <= 2 && <ChildRegionTable />}</div>
      </Container>
    </Fragment>
  );

  function ChildRegionTable() {
    return (
      <div>
        <h4>
          {REGION_LEVEL[tabIndex + 1]} {selectedRegionName}
        </h4>
        <ListRegionsPage countryId={countryId} parentId={selectedRegion} tabIndex={tabIndex + 1} />
      </div>
    );
  }
};
export default withAuth(withLayout(ListRegionsPage));
