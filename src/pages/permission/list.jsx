import { Col, Container, Portlet, Row } from '@blueupcode/components';
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { getPermissionList } from 'utils/label/';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import { swal } from 'components/swal/instance';
import { TableFooter } from 'components/UI/features';
import { MultipleSelect, ToggleActive, Search } from 'components/UI/Permission';
import PAGE from 'config/page.config';
import { isEmpty } from 'lodash';
import Head from 'next/head';
import React, { Fragment, useEffect, useState } from 'react';
import {
  countryApi,
  genderApi,
  languageApi,
  menuApi,
  permissionApi,
  personApi,
  regionApi,
  userGroupApi,
} from 'services';
import { pageChangeHeaderTitle, setLabel } from 'store/actions';
import styles from 'styles/pages/permission.module.scss';
import { Grid } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const modules = [
  { id: 0, name: 'All', selected: false },
  { id: 1, name: 'Languages', selected: false, api: languageApi },
  { id: 2, name: 'Persons', selected: false, api: personApi },
  { id: 3, name: 'Genders', selected: false, api: genderApi },
  { id: 4, name: 'Regions', selected: false, api: regionApi },
  { id: 5, name: 'Countries', selected: false, api: countryApi },
  { id: 6, name: 'UserGroup', selected: false, api: userGroupApi },
  { id: 7, name: 'Menu', selected: false, api: menuApi },
];

const columns = ['ID', 'Name', 'Code', 'Permission'];

const permissionList = [
  'button_export',
  'button_import',
  'button_create',
  'tooltip_filter',
  'tooltip_show_hide_column',
  'tooltip_search',
];
const ListPermission = () => {
  const [loading, setLoading] = useState(false);
  const [permissionLabel, setPermissionLabel] = useState({});
  const [userGroup, setUserGroup] = useState('');

  const [userGroupSelected, setUserGroupSelected] = useState(0);
  const [permissions, setPermissions] = useState(modules);
  const [permissionsSelected, setPermissionsSelected] = useState([]);
  const [dataPermission, setDataPermission] = useState([]);
  const [isReloadData, setIsReloadData] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [dataOnPage, setDataOnPage] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [totalPage, setTotalPage] = useState(0);

  const dispatch = useDispatch();

  const handleChangeUserGroup = (event) => {
    setUserGroupSelected(event.target.value);
  };
  const changePermission = (objPermission) => {
    async function fetchApi() {
      setLoading(true);
      try {
        const response = await permissionApi.upsertPermission({
          idUserGroup: userGroupSelected,
          data: [objPermission],
        });
        if (response.status === 200) {
          setIsReloadData(!isReloadData);
          swal.fire({ text: response.data.message, icon: 'success' });
        }
      } catch (error) {
        swal.fire({ text: error.message, icon: 'error' });
      }
      setLoading(false);
    }
    fetchApi();
  };

  useEffect(() => {
    async function fetchLabel() {
      setLoading(true);
      try {
        const response = await permissionApi.getLabelList();
        if (response.status === 200) {
          const dataLabel = response.data.data;
          if (dataLabel && dataLabel.length > 0) {
            // Missing data title page (replace with button index)
            const permissionLabel = getPermissionList(dataLabel);
            dispatch(pageChangeHeaderTitle(permissionLabel.titlePage));
            dispatch(setLabel({ label: permissionLabel }));
            setPermissionLabel(permissionLabel);
          }
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (error) {
        swal.fire({ text: error.message, icon: 'error' });
      }
      setLoading(false);
    }

    async function fetchUserGroup() {
      setTableLoading(true);
      try {
        let response = await userGroupApi.getUserGroupList({
          orderBy: 'id',
          direction: 'asc',
          perPage: '',
          page: 1,
          searchAll: '',
        });

        if (response.status === 200) {
          setUserGroup(response.data.data);
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (error) {
        swal.fire({ text: error.message, icon: 'error' });
      }
      setTableLoading(false);
    }

    fetchLabel();
    fetchUserGroup();
  }, []);

  const render = () => {
    const limit = rowsPerPage;
    const start = (page - 1) * limit;

    const dataFiltered = keyword
      ? dataPermission.filter((item) => item.code.includes(keyword) || item.name.includes(keyword))
      : dataPermission;

    const dataOnPage = dataFiltered.slice(start, start + limit);
    setTotalPage(dataFiltered.filter((item) => !item.code.includes('tooltip')).length);
    setDataOnPage(dataOnPage);
  };

  useEffect(() => {
    render();
  }, [dataPermission, page, rowsPerPage, columns]);

  useEffect(() => {
    if (page === 1 && rowsPerPage === 10) return render();
    setPage(1);
    setRowsPerPage(10);
  }, [keyword]);

  useEffect(() => {
    if (!(permissionsSelected && permissionsSelected.length > 0 && userGroupSelected)) return;
    async function fetchApi() {
      setTableLoading(true);
      let newData = [];
      await Promise.allSettled(
        permissionsSelected.map(async (item) => {
          return item.api.getLabelList({ idUserGroup: userGroupSelected, table: 'viewControl' });
        })
      )
        .then((results) => {
          results.forEach((e) => (e.status === 'fulfilled' ? (newData = [...newData, ...e.value.data.data]) : null));
          setDataPermission(
            newData.filter((item) => {
              return permissionList.some((d) => item.code.includes(d));
            })
          );
        })
        .catch((error) => {
          console.log(Promise.resolve(error));
        });
      setTableLoading(false);
    }
    fetchApi();
  }, [permissionsSelected, userGroupSelected, isReloadData]);

  return (
    <Fragment>
      <Head>
        <title>Table | {PAGE.siteName}</title>
      </Head>
      <Container fluid>
        {loading ? (
          <div className={styles.loading} align="center">
            <CircularProgress disableShrink />
          </div>
        ) : !isEmpty(permissionLabel) ? (
          <>
            <Row>
              <Grid container direction="row" justifyContent="space-between" alignItems="center" paddingX={5}>
                <Grid>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">User Group</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={userGroupSelected}
                      label="User Group"
                      onChange={handleChangeUserGroup}
                      className={styles.dropdownSelect}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
                          },
                        },
                        classes: { paper: styles.dropdownOptions },
                        variant: 'menu',
                      }}
                    >
                      <MenuItem value={0}>
                        <div className={styles.text}>--Select user group--</div>
                      </MenuItem>
                      {userGroup &&
                        userGroup.length > 0 &&
                        userGroup.map((item, index) => (
                          <MenuItem className={styles.text} key={index} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <MultipleSelect
                    label={'Modules'}
                    options={permissions}
                    setOptions={setPermissions}
                    setSelected={setPermissionsSelected}
                  />
                </Grid>
                {userGroupSelected != 0 && !isEmpty(permissionsSelected) && (
                  <Grid>
                    <Search keyword={keyword} setKeyword={setKeyword} />
                  </Grid>
                )}
              </Grid>
            </Row>
            <Row>
              <Col md="12">
                <Portlet>
                  <Portlet.Body>
                    {userGroupSelected != 0 && !isEmpty(permissionsSelected) && (
                      <Box sx={{ width: '100%' }}>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                          <TableContainer>
                            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                              <TableHead>
                                <TableRow>
                                  {columns.map((headCell, index) => (
                                    <TableCell
                                      key={index}
                                      align="left"
                                      style={{ fontSize: '15px', fontWeight: 'bold' }}
                                    >
                                      {headCell}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {tableLoading ? (
                                  <TableRow>
                                    <TableCell align="center" colSpan={10}>
                                      <div className={styles.loading}>
                                        <CircularProgress disableShrink />
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  <>
                                    {dataOnPage
                                      .filter((item) => !item.code.includes('tooltip'))
                                      .map((item, index) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={`permission-${index}`}>
                                          <TableCell align="left" width="10%" className={styles.tableCell}>
                                            {item.id}
                                          </TableCell>
                                          <TableCell align="left" width="10%" className={styles.tableCell}>
                                            {item.name}
                                          </TableCell>
                                          <TableCell align="left" width="10%" className={styles.tableCell}>
                                            {item.code}
                                          </TableCell>
                                          <TableCell align="left" width="10%" className={styles.tableCell}>
                                            <ToggleActive
                                              changePermission={changePermission}
                                              dataPermission={dataPermission}
                                              permission={item}
                                            />
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                  </>
                                )}
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
                            <Typography align="center" className={`${styles.noData} ${styles.text} p-2`}>
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
          </>
        ) : (
          <Typography align="center" className={styles.noData}>
            There are no labels to display
          </Typography>
        )}
      </Container>
    </Fragment>
  );
};

export default withAuth(withLayout(ListPermission));
