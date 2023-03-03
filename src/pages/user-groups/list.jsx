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
import { USER_GROUP_COLUMN } from 'config/data-table-column';
import Head from 'next/head';
import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useDispatch } from 'react-redux';
import { userGroupApi, commonApi } from 'services';
import { pageChangeHeaderTitle, setLabel } from 'store/actions';
import styles from 'styles/pages/userGroup-list.module.scss';
import { colTableConfig } from 'utils/';
import { getUserGroupList } from 'utils/label/';
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
  CreateUserGroupModal,
  ModalDeleteUserGroup,
  ModalSwitchUserGroup,
  ToggleActive,
  UpdateUserGroupModal,
  AddUserIntoUserGroup,
} from '../../components/UI/UserGroup/UserGroupList';

const codeTable = 'userGroup.index';
const ListUserGroupsPage = (props) => {
  const { userConfig } = props;

  const router = useRouter();

  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [tableAddUser, setTableAddUser] = useState(false);
  const [dataOnPage, setDataOnPage] = React.useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isReloadData, setIsReloadData] = useState(false);
  const [columns, setColumns] = useState(USER_GROUP_COLUMN);
  const [isEdit, setIsEdit] = useState(false);

  const [popUpConfirm, setPopUpConfirm] = useState(false);
  const [popUpConfirmDelete, setPopUpConfirmDelete] = useState(false);
  const [currentStatusUserGroup, setCurrentStatusUserGroup] = useState(false);
  const [currentIdUserGroup, setCurrentIdUserGroup] = useState(null);
  const [popupUpdateUserGroup, setPopupUpdateUserGroup] = useState(false);
  const [popupCreateUserGroup, setPopupCreateUserGroup] = useState(false);
  const [selectedUserGroup, setSelectedUserGroup] = useState(null);

  const [page, setPage] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('');
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [totalPage, setTotalPage] = useState(0);

  const [textSearch, setTextSearch] = useState('');
  const [colTableSearch, setColTableSearch] = useState([
    { name: 'id', value: '', key: 'id', isDisplay: false },
    { name: 'name', value: '', key: 'name', isDisplay: false },
    { name: 'group title', value: '', key: 'group_title', isDisplay: false },
    { name: 'description', value: '', key: 'description', isDisplay: false },
  ]);

  const [typeFilter, setTypeFilter] = useState('and');
  const dispatch = useDispatch();
  const [dataLabel, setDataLabel] = useState([]);
  const [userGroupLabel, setUserGroupLabel] = useState({});

  const handlePopupUpdateUserGroup = (idUserGroup, isUpdate) => {
    if (isUpdate) {
      router.push(`/user-groups/update/${idUserGroup}`);
    } else {
      router.push(`/user-groups/${idUserGroup}`);
    }
  };

  const handlePopupDeleteUserGroup = (idUserGroup) => {
    setPopUpConfirmDelete(true);
    setSelectedUserGroup(idUserGroup);
  };

  const handlePopupCreateUserGroup = (idUserGroup) => {
    router.push(`/user-groups/create`);
  };

  const handlePopupAddUserIntoUserGroup = (idUserGroup) => {
    setTableAddUser(true);
    setSelectedUserGroup(idUserGroup);
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
      const userGroupLabel = getUserGroupList(dataLabel);
      dispatch(pageChangeHeaderTitle(userGroupLabel.titlePage));
      dispatch(setLabel({ label: userGroupLabel }));
      setUserGroupLabel(userGroupLabel);
    }
  }, [dataLabel]);

  useEffect(() => {
    setPageLoading(true);
    async function getUserGroupLabel() {
      try {
        let response = await userGroupApi.getUserGroupLabel();
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
    getUserGroupLabel();
  }, []);

  useEffect(() => {
    async function fetchLanguageList() {
      setTableLoading(true);
      try {
        let response = await userGroupApi.getUserGroupList({
          orderBy: orderBy,
          direction: order,
          perPage: rowsPerPage,
          page: page,
          searchAll: textSearch,
          id: colTableSearch.find((item) => item.key === 'id').value,
          name: colTableSearch.find((item) => item.key === 'name').value,
          groupTitle: colTableSearch.find((item) => item.key === 'group_title').value,
          description: colTableSearch.find((item) => item.key === 'description').value,
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
      let response = await userGroupApi.getUserGroupList({
        orderBy: orderBy,
        direction: order,
        perPage: '',
        page: page,
        searchAll: isSearchAll ? '' : textSearch,
        id: colTableSearch.find((item) => item.key === 'id').value,
        name: colTableSearch.find((item) => item.key === 'name').value,
        groupTitle: colTableSearch.find((item) => item.key === 'group_title').value,
        description: colTableSearch.find((item) => item.key === 'description').value,
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
          { name: 'group title', value: '', key: 'group_title', isDisplay: userConfig.column_config.group_title },
          {
            name: 'description',
            value: '',
            key: 'description',
            isDisplay: userConfig.column_config.column_description,
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
      { name: 'id', value: '', key: 'id', isDisplay: userConfig.column_config.column_id },
      { name: 'name', value: '', key: 'name', isDisplay: userConfig.column_config.column_name },
      { name: 'group title', value: '', key: 'group_title', isDisplay: userConfig.column_config.group_title },
      { name: 'description', value: '', key: 'description', isDisplay: userConfig.column_config.column_description },
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
                    <CreateModal label={userGroupLabel} onClick={handlePopupCreateUserGroup} />
                    <ButtonPermission
                      component={ToggleEditLabel}
                      permission={true}
                      label={userGroupLabel.tooltipSwitch}
                    />
                    <ButtonPermission
                      component={ImportData}
                      permission={userGroupLabel.btnImport?.isPermission}
                      label={userGroupLabel}
                      disableBtn={true}
                    />
                    <ButtonPermission
                      component={ExportData}
                      permission={userGroupLabel.btnExport?.isPermission}
                      label={userGroupLabel}
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
                      label={userGroupLabel.tooltipSearch}
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
                      label={userGroupLabel.tooltipFilter}
                      typeFilter={typeFilter}
                      setTypeFilter={setTypeFilter}
                      handleSearchAndFilter={handleSearchAndFilter}
                    />
                    <ButtonPermission
                      component={ToggleVisibilityColTable}
                      permission={true}
                      columns={columns}
                      setColumns={setColumns}
                      languageLabel={userGroupLabel}
                      codeTable={codeTable}
                      userConfig={userConfig}
                      label={userGroupLabel.tooltipShowHideColumn}
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
                              languageLabel={userGroupLabel}
                            />
                            <TableBody>
                              {dataOnPage.map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={`user-group-table-${row.id}`}>
                                  {columns.map((column) =>
                                    column.visibility && column.label === 'action' ? (
                                      <TableCell
                                        align="left"
                                        width="10px"
                                        className={styles.tableCell}
                                        key={`user-group-table-cell-${column.key}-${row.id}`}
                                      >
                                        <Action
                                          id={row.id}
                                          handlePopupUpdateUserGroup={handlePopupUpdateUserGroup}
                                          handlePopupDeleteUserGroup={handlePopupDeleteUserGroup}
                                          handlePopupAddUserIntoUserGroup={handlePopupAddUserIntoUserGroup}
                                          label={userGroupLabel}
                                        />
                                      </TableCell>
                                    ) : column.visibility && column.label === 'isActive' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`user-group-table-cell-${column.key}-${row.id}`}
                                      >
                                        <ToggleActive
                                          id={row.id}
                                          isActive={row[column.label]}
                                          setPopUpConfirm={setPopUpConfirm}
                                          setCurrentIdUserGroup={setCurrentIdUserGroup}
                                          setCurrentStatusUserGroup={setCurrentStatusUserGroup}
                                        />
                                      </TableCell>
                                    ) : column.visibility && column.label === 'icon' ? (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`user-group-table-cell-${column.key}-${row.id}`}
                                      >
                                        <img src={row[column.label]} alt={row.name} width={30} height={30} />
                                      </TableCell>
                                    ) : (
                                      column.visibility && (
                                        <TableCell
                                          align="left"
                                          className={styles.tableCell}
                                          key={`user-group-table-cell-${column.key}-${row.id}`}
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
        <ModalSwitchUserGroup
          popUpConfirm={popUpConfirm}
          setPopUpConfirm={setPopUpConfirm}
          currentIdUserGroup={currentIdUserGroup}
          setIsReloadData={setIsReloadData}
          isReloadData={isReloadData}
          isActive={!currentStatusUserGroup}
        />
        {popupUpdateUserGroup && (
          <UpdateUserGroupModal
            id={selectedUserGroup}
            title="Update UserGroup"
            onClose={() => setPopupUpdateUserGroup(false)}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
            setPopupUpdateUserGroup={setPopupUpdateUserGroup}
            readOnly={!isEdit}
          />
        )}
        {popUpConfirmDelete && (
          <ModalDeleteUserGroup
            popUpConfirm={popUpConfirmDelete}
            setPopUpConfirm={setPopUpConfirmDelete}
            currentIdUserGroup={selectedUserGroup}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
          />
        )}
        {popupCreateUserGroup && (
          <CreateUserGroupModal
            title="Create UserGroup"
            onClose={() => setPopupCreateUserGroup(false)}
            setIsReloadData={setIsReloadData}
            isReloadData={isReloadData}
            setPopupCreateUserGroup={setPopupCreateUserGroup}
          />
        )}
        {tableAddUser && (
          <AddUserIntoUserGroup
            tableAddUser={tableAddUser}
            setTableAddUser={setTableAddUser}
            selectedUserGroup={selectedUserGroup}
          />
        )}
      </Container>
    </Fragment>
  );
};

export default withAuth(withLayout(() => <TableWithConfig CodeTable={codeTable} PageView={ListUserGroupsPage} />));
