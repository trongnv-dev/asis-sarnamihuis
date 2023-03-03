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
import withLayout from 'components/layout/withLayout';
import { swal } from 'components/swal/instance';
import PAGE from 'config/page.config';
import { PERSON_UPLOAD_COLUMN } from 'config/data-table-column';
import Head from 'next/head';
import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { personUploadApi, commonApi } from 'services';
import { pageChangeHeaderTitle, setLabel } from 'store/actions';
import styles from 'styles/pages/person-upload-list.module.scss';
import { sortData, colTableConfig } from 'utils/';
import { getPersonUploadList } from 'utils/label/';
import { useRouter } from 'next/dist/client/router';
import { faFilePdf, faFileWord, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeSvgIcon from 'components/UI/atoms/FontAwesomeSvgIcon';

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
  ButtonPermission,
} from '../../components/UI/features';
import {
  Action,
  ModalDeletePersonUpload,
  ToggleActive,
} from '../../components/UI/PersonUpload/PersonUploadList';
const ListFileUploadsPage = (props) => {
  const { idRelPerson } = props;
  const [userConfig, setUserConfig] = useState(null);
  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataOnPage, setDataOnPage] = React.useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isReloadData, setIsReloadData] = useState(false);
  const [columns, setColumns] = useState(PERSON_UPLOAD_COLUMN);
  const router = useRouter();

  const [popUpConfirm, setPopUpConfirm] = useState(false);
  const [popUpConfirmDelete, setPopUpConfirmDelete] = useState(false);
  const [currentStatusPersonUpload, setCurrentStatusPersonUpload] = useState(false);
  const [currentIdPersonUpload, setCurrentIdPersonUpload] = useState(null);
  const [selectedPersonUpload, setSelectedPersonUpload] = useState(null);
  const [codeTable, setCodeTable] = useState('personUpload.index');

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [totalPage, setTotalPage] = useState(0);

  const [typeFilter, setTypeFilter] = useState('and');
  const [textSearch, setTextSearch] = useState('');
  const [colTableSearch, setColTableSearch] = useState([
    { name: 'id', value: '', key: 'id', isDisplay: false },
    { name: 'name', value: '', key: 'name', isDisplay: false },
  ]);

  const dispatch = useDispatch();
  const [dataLabel, setDataLabel] = useState([]);
  const [personUploadLabel, setPersonUploadLabel] = useState({});

  const handlePopupUpdatePersonUpload = (idPersonUpload, isUpdate) => {
    if (!isUpdate) {
      router.push(`/person-uploads/${idPersonUpload}`);
    } else {
      router.push(`/person-uploads/update/${idPersonUpload}`);
    }
  };

  const handlePopupDeletePersonUpload = (idPersonUpload) => {
    setPopUpConfirmDelete(true);
    setSelectedPersonUpload(idPersonUpload);
  };

  const handlePopupCreatePersonUpload = () => {
    router.push(`/person-uploads/create/${idRelPerson}`);
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
      const personUploadLabel = getPersonUploadList(dataLabel);
      dispatch(pageChangeHeaderTitle(personUploadLabel.titlePage));
      dispatch(setLabel({ label: personUploadLabel }));
      setPersonUploadLabel(personUploadLabel);
    }
  }, [dataLabel]);

  useEffect(() => {
    setPageLoading(true);
    async function getPersonUploadLabel() {
      try {
        let response = await personUploadApi.getPersonUploadLabel();
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
    getPersonUploadLabel();
  }, []);

  useEffect(() => {
    async function fetchLanguageList() {
      setTableLoading(true);
      try {
        let response = await personUploadApi.getPersonUploadList({
          orderBy: orderBy,
          direction: order,
          perPage: rowsPerPage,
          page: page,
          searchAll: textSearch,
          id: colTableSearch.find((item) => item.key === 'id').value,
          name: colTableSearch.find((item) => item.key === 'name').value,
          idRelPerson: idRelPerson,
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
      let response = await personUploadApi.getPersonUploadList({
        orderBy: orderBy,
        direction: order,
        perPage: rowsPerPage,
        page: page,
        searchAll: textSearch,
        id: colTableSearch.find((item) => item.key === 'id').value,
        name: colTableSearch.find((item) => item.key === 'name').value,
        idRelPerson: idRelPerson,
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

  const getTypeFileIcon = (source) => {
    var type = source.toString().split('.').slice(-1)[0];
    switch (type) {
      case "png":
      case "jpg":
      case "jpeg":
        return <a href={`${window.location.origin}${source}`} target="_blank">
          <img src={`${window.location.origin}${source}`} width={100} height={100} />
        </a>
      case "pdf":
        return <a href={`${window.location.origin}${source}`} target="_blank">
          <FontAwesomeSvgIcon icon={faFilePdf} />
        </a>
      case "docx":
      case "dot":
      case "dotx":
      case "txt":
        return <a href={`${window.location.origin}${source}`} target="_blank">
          <FontAwesomeSvgIcon icon={faFileWord} />
        </a>
      case "xlsl":
      case "csv":
        return <a href={`${window.location.origin}${source}`} target="_blank">
          <FontAwesomeSvgIcon icon={faFileExcel} />
        </a>
      default:
        break
    }
  }
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
                    <CreateModal label={personUploadLabel} onClick={handlePopupCreatePersonUpload} />
                    <ButtonPermission component={ToggleEditLabel} permission={true} label={personUploadLabel.tooltipSwitch} />
                    <ButtonPermission
                      component={ImportData}
                      permission={personUploadLabel.btnImport?.isPermission}
                      label={personUploadLabel}
                      disableBtn={true}
                    />
                    <ButtonPermission
                      component={ExportData}
                      permission={personUploadLabel.btnExport?.isPermission}
                      label={personUploadLabel}
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
                      label={personUploadLabel.tooltipSearch}
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
                      label={personUploadLabel.tooltipFilter}
                      typeFilter={typeFilter}
                      setTypeFilter={setTypeFilter}
                      handleSearchAndFilter={handleSearchAndFilter}
                    />
                    <ButtonPermission
                      component={ToggleVisibilityColTable}
                      permission={true}
                      columns={columns}
                      setColumns={setColumns}
                      languageLabel={personUploadLabel}
                      codeTable={codeTable}
                      userConfig={userConfig}
                      label={personUploadLabel.tooltipShowHideColumn}
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
                            languageLabel={personUploadLabel}
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
                                <TableRow hover role="checkbox" tabIndex={-1} key={`personUpload-${row.id}`}>
                                  {columns.map((column) =>
                                    column.visibility && column.label === 'action' ? (
                                      <TableCell
                                        align="left"
                                        width="10px"
                                        className={styles.tableCell}
                                        key={`personUpload-table-cell-${column.key}-${row.id}`}
                                      >
                                        <Action
                                          id={row.id}
                                          handlePopupUpdatePersonUpload={handlePopupUpdatePersonUpload}
                                          handlePopupDeletePersonUpload={handlePopupDeletePersonUpload}
                                          label={personUploadLabel}
                                        />
                                      </TableCell>
                                    ) : column.visibility && column.label === 'isActive' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`personUpload-table-cell-${column.key}-${row.id}`}
                                      >
                                        <ToggleActive
                                          id={row.id}
                                          isActive={row[column.label]}
                                          setPopUpConfirm={setPopUpConfirm}
                                          setCurrentIdPersonUpload={setCurrentIdPersonUpload}
                                          setCurrentStatusPersonUpload={setCurrentStatusPersonUpload}
                                        />
                                      </TableCell>
                                    ) : column.visibility && column.label === 'icon' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`personUpload-table-cell-${column.key}-${row.id}`}
                                      >
                                        <img src={row[column.label]} alt={row.name} width={30} height={30} />
                                      </TableCell>
                                    ) : column.visibility && column.label === 'uploadFile' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`personUpload-table-cell-${column.key}-${row.id}`}
                                      >
                                        {/* <a href={`${window.location.origin}${row[column.label]}`} target="_blank">{row[column.label]}</a> */}
                                        {getTypeFileIcon(row[column.label])}
                                      </TableCell>
                                    ) : (
                                      column.visibility && (
                                        <TableCell
                                          align="left"
                                          className={styles.tableCell}
                                          key={`personUpload-table-cell-${column.key}-${row.id}`}
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
        {popUpConfirmDelete && (
          <ModalDeletePersonUpload
            popUpConfirm={popUpConfirmDelete}
            setPopUpConfirm={setPopUpConfirmDelete}
            currentIdPersonUpload={selectedPersonUpload}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
          />
        )}
      </Container>
    </Fragment>
  );
};

export default withLayout(ListFileUploadsPage);
