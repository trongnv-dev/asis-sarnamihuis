import { Col, Container, Portlet, Row } from '@blueupcode/components';
import { useRouter } from 'next/dist/client/router';
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
import { PERSON_COLUMN } from 'config/data-table-column';
import _debounce from 'lodash/debounce';
import Head from 'next/head';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { personApi, commonApi } from 'services';
import { pageChangeHeaderTitle, setLabel } from 'store/actions';
import styles from 'styles/pages/person-list.module.scss';
import { colTableConfig } from 'utils/';
import { getPersonList } from 'utils/label/';
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
import { Action, CreatePersonModal, ModalDeletePerson, UpdatePersonModal } from '../../components/UI/Person/PersonList';
import ListFileUploadsPage from '../person-uploads/list';

const codeTable = 'person.index';
const ListPersonsPage = (props) => {
  const { userConfig } = props;

  const router = useRouter();

  const [dataOnPage, setDataOnPage] = React.useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isReloadData, setIsReloadData] = useState(false);
  const [columns, setColumns] = useState(PERSON_COLUMN);
  const [isEdit, setIsEdit] = useState(false);

  const [popUpConfirmDelete, setPopUpConfirmDelete] = useState(false);
  const [popupUpdatePerson, setPopupUpdatePerson] = useState(false);
  const [popupCreatePerson, setPopupCreatePerson] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [totalPage, setTotalPage] = useState(0);
  const [textSearch, setTextSearch] = useState('');
  const [colTableSearch, setColTableSearch] = useState([
    { name: 'id', value: '', key: 'id', isDisplay: false },
    { name: 'lastName', value: '', key: 'last_name', isDisplay: false },
    { name: 'middleName', value: '', key: 'middle_name', isDisplay: false },
    { name: 'firstName', value: '', key: 'first_name', isDisplay: false },
    { name: 'genderName', value: '', key: 'gender_name', isDisplay: false },
    { name: 'address', value: '', key: 'address', isDisplay: false },
    { name: 'place', value: '', key: 'place', isDisplay: false },
    { name: 'telephone1', value: '', key: 'telephone1', isDisplay: false },
    { name: 'telephone2', value: '', key: 'telephone2', isDisplay: false },
    { name: 'email1', value: '', key: 'email1', isDisplay: false },
    { name: 'email2', value: '', key: 'email2', isDisplay: false },
    { name: 'person', value: '', key: 'person', isDisplay: false },
  ]);
  const [typeFilter, setTypeFilter] = useState('and');

  const dispatch = useDispatch();
  const [personLabel, setPersonLabel] = useState({});
  const [dataLabel, setDataLabel] = useState([]);
  const [showFileUploadTable, setShowFileUploadTable] = useState(false);
  const [selectedPersonUpload, setSelectedPersonUpload] = useState(null);
  const [selectedPersonUploadName, setSelectedPersonUploadName] = useState(null);

  const handlePopupUpdatePerson = (idPerson, isUpdate) => {
    if (isUpdate) {
      router.push(`/persons/update/${idPerson}`);
    } else {
      router.push(`/persons/${idPerson}`);
    }
  };

  const handlePopupDeletePerson = (idPerson) => {
    setPopUpConfirmDelete(true);
    setSelectedPerson(idPerson);
  };

  const handlePopupCreatePerson = () => {
    router.push(`/persons/create`);
  };

  const handleShowFileUpload = (personId, personName) => {
    setSelectedPersonUpload(personId);
    setSelectedPersonUploadName(personName);
    setShowFileUploadTable(true);
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
    if (dataLabel && dataLabel.length > 0) {
      const personLabel = getPersonList(dataLabel);
      dispatch(pageChangeHeaderTitle(personLabel.titlePage));
      dispatch(setLabel({ label: personLabel }));
      setPersonLabel(personLabel);
    }
  }, [dataLabel]);

  useEffect(() => {
    setPageLoading(true);
    async function fetchPersonLabel() {
      try {
        let response = await personApi.getPersonLabel();
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
    fetchPersonLabel();
  }, []);

  useEffect(() => {
    setTableLoading(true);
    async function fetchListPerson() {
      try {
        let response = await personApi.getPersonList({
          orderBy: orderBy,
          direction: order,
          perPage: rowsPerPage,
          page: page,
          searchAll: textSearch,
          id: colTableSearch.find((item) => item.key === 'id').value,
          lastName: colTableSearch.find((item) => item.key === 'last_name').value,
          middleName: colTableSearch.find((item) => item.key === 'middle_name').value,
          firstName: colTableSearch.find((item) => item.key === 'first_name').value,
          genderName: colTableSearch.find((item) => item.key === 'gender_name').value,
          address: colTableSearch.find((item) => item.key === 'address').value,
          place: colTableSearch.find((item) => item.key === 'place').value,
          telephone1: colTableSearch.find((item) => item.key === 'telephone1').value,
          telephone2: colTableSearch.find((item) => item.key === 'telephone2').value,
          email1: colTableSearch.find((item) => item.key === 'email1').value,
          email2: colTableSearch.find((item) => item.key === 'email2').value,
          idRelPersonUpload: colTableSearch.find((item) => item.key === 'person').value,
          filterOption: typeFilter,
        });
        if (response.status === 200) {
          const data = response.data.data;
          setTotalPage(response.data.meta.total[0]);
          setDataOnPage(data);
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (error) {
        swal.fire({ text: error.message, icon: 'error' });
      }
      setTableLoading(false);
    }
    fetchListPerson();
  }, [isReloadData, page, rowsPerPage, columns, order, orderBy]);

  const getDataExport = async (isSearchAll) => {
    try {
      let response = await personApi.getPersonList({
        orderBy: orderBy,
        direction: order,
        perPage: '',
        page: page,
        searchAll: isSearchAll ? '' : textSearch,
        id: colTableSearch.find((item) => item.key === 'id').value,
        lastName: colTableSearch.find((item) => item.key === 'last_name').value,
        middleName: colTableSearch.find((item) => item.key === 'middle_name').value,
        firstName: colTableSearch.find((item) => item.key === 'first_name').value,
        genderName: colTableSearch.find((item) => item.key === 'gender_name').value,
        address: colTableSearch.find((item) => item.key === 'address').value,
        place: colTableSearch.find((item) => item.key === 'place').value,
        telephone1: colTableSearch.find((item) => item.key === 'telephone1').value,
        telephone2: colTableSearch.find((item) => item.key === 'telephone2').value,
        email1: colTableSearch.find((item) => item.key === 'email1').value,
        email2: colTableSearch.find((item) => item.key === 'email2').value,
        idRelPersonUpload: colTableSearch.find((item) => item.key === 'person').value,
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
          {
            name: 'id',
            value: '',
            key: 'id',
            isDisplay: userConfig.column_config.column_id,
          },
          {
            name: 'lastName',
            value: '',
            key: 'last_name',
            isDisplay: userConfig.column_config.column_last_name,
          },
          {
            name: 'middleName',
            value: '',
            key: 'middle_name',
            isDisplay: userConfig.column_config.column_middle_name,
          },
          {
            name: 'firstName',
            value: '',
            key: 'first_name',
            isDisplay: userConfig.column_config.column_first_name,
          },
          {
            name: 'genderName',
            value: '',
            key: 'gender_name',
            isDisplay: userConfig.column_config.column_gender_name,
          },
          {
            name: 'address',
            value: '',
            key: 'address',
            isDisplay: userConfig.column_config.column_address,
          },
          {
            name: 'place',
            value: '',
            key: 'place',
            isDisplay: userConfig.column_config.column_place,
          },
          {
            name: 'telephone1',
            value: '',
            key: 'telephone1',
            isDisplay: userConfig.column_config.column_telephone1,
          },
          {
            name: 'telephone2',
            value: '',
            key: 'telephone2',
            isDisplay: userConfig.column_config.column_telephone2,
          },
          {
            name: 'email1',
            value: '',
            key: 'email1',
            isDisplay: userConfig.column_config.column_email1,
          },
          {
            name: 'email2',
            value: '',
            key: 'email2',
            isDisplay: userConfig.column_config.column_email2,
          },
          {
            name: 'person',
            value: '',
            key: 'person',
            isDisplay: userConfig.column_config.column_person,
          },
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
      {
        name: 'id',
        value: '',
        key: 'id',
        isDisplay: userConfig.column_config.column_id,
      },
      {
        name: 'lastName',
        value: '',
        key: 'last_name',
        isDisplay: userConfig.column_config.column_last_name,
      },
      {
        name: 'middleName',
        value: '',
        key: 'middle_name',
        isDisplay: userConfig.column_config.column_middle_name,
      },
      {
        name: 'firstName',
        value: '',
        key: 'first_name',
        isDisplay: userConfig.column_config.column_first_name,
      },
      {
        name: 'genderName',
        value: '',
        key: 'gender_name',
        isDisplay: userConfig.column_config.column_gender_name,
      },
      {
        name: 'address',
        value: '',
        key: 'address',
        isDisplay: userConfig.column_config.column_address,
      },
      {
        name: 'place',
        value: '',
        key: 'place',
        isDisplay: userConfig.column_config.column_place,
      },
      {
        name: 'telephone1',
        value: '',
        key: 'telephone1',
        isDisplay: userConfig.column_config.column_telephone1,
      },
      {
        name: 'telephone2',
        value: '',
        key: 'telephone2',
        isDisplay: userConfig.column_config.column_telephone2,
      },
      {
        name: 'email1',
        value: '',
        key: 'email1',
        isDisplay: userConfig.column_config.column_email1,
      },
      {
        name: 'email2',
        value: '',
        key: 'email2',
        isDisplay: userConfig.column_config.column_email2,
      },
      {
        name: 'person',
        value: '',
        key: 'person',
        isDisplay: userConfig.column_config.column_person,
      },
    ]);
  }, [columns]);

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
                    <CreateModal label={personLabel} onClick={handlePopupCreatePerson} />
                    <ButtonPermission component={ToggleEditLabel} permission={true} label={personLabel.tooltipSwitch} />
                    <ButtonPermission
                      component={ImportData}
                      permission={personLabel.btnImport?.isPermission}
                      label={personLabel}
                      disableBtn={true}
                    />
                    <ButtonPermission
                      component={ExportData}
                      permission={personLabel.btnExport?.isPermission}
                      label={personLabel}
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
                      label={personLabel.tooltipSearch}
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
                      label={personLabel.tooltipFilter}
                      typeFilter={typeFilter}
                      setTypeFilter={setTypeFilter}
                      handleSearchAndFilter={handleSearchAndFilter}
                    />
                    <ButtonPermission
                      component={ToggleVisibilityColTable}
                      permission={true}
                      columns={columns}
                      setColumns={setColumns}
                      languageLabel={personLabel}
                      codeTable={codeTable}
                      userConfig={userConfig}
                      disable={false}
                      label={personLabel.tooltipShowHideColumn}
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
                            languageLabel={personLabel}
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
                              {dataOnPage.map((row, _index) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={`person-${row.id}`}>
                                  {columns.map((column) =>
                                    column.visibility && column.label === 'action' ? (
                                      <TableCell
                                        align="left"
                                        width="10px"
                                        className={styles.tableCell}
                                        key={`person-table-cell-${column.key}-${row.id}`}
                                      >
                                        <Action
                                          id={row.id}
                                          handlePopupUpdatePerson={handlePopupUpdatePerson}
                                          handlePopupDeletePerson={handlePopupDeletePerson}
                                          handleShowFileUpload={handleShowFileUpload}
                                          personName={`${row.lastName} ${row.middleName} ${row.firstName}`}
                                          label={personLabel}
                                        />
                                      </TableCell>
                                    ) : (
                                      column.visibility && (
                                        <TableCell
                                          align="left"
                                          className={styles.tableCell}
                                          key={`person-table-cell-${column.key}-${row.id}`}
                                        >
                                          {row[column.label] || 'NULL'}
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
        {popupUpdatePerson && (
          <UpdatePersonModal
            id={selectedPerson}
            title="Update Person"
            onClose={() => setPopupUpdatePerson(false)}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
            setPopupUpdatePerson={setPopupUpdatePerson}
            readOnly={!isEdit}
          />
        )}
        {popUpConfirmDelete && (
          <ModalDeletePerson
            popUpConfirm={popUpConfirmDelete}
            setPopUpConfirm={setPopUpConfirmDelete}
            currentIdPerson={selectedPerson}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
          />
        )}
        {popupCreatePerson && (
          <CreatePersonModal
            page={page}
            setPage={setPage}
            setOrder={setOrder}
            setOrderBy={setOrderBy}
            title="Create Person"
            onClose={() => setPopupCreatePerson(false)}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
            setPopupCreatePerson={setPopupCreatePerson}
          />
        )}
      </Container>
      {showFileUploadTable && <FileUploadTable />}
    </Fragment>
  );

  function FileUploadTable() {
    return (
      <div>
        <h4>
          {selectedPersonUploadName}
          {selectedPersonUpload}
        </h4>
        <ListFileUploadsPage idRelPerson={selectedPersonUpload}></ListFileUploadsPage>
      </div>
    );
  }

};
export default withAuth(withLayout(() => <TableWithConfig CodeTable={codeTable} PageView={ListPersonsPage} />));
