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
import { MESSAGE_COLUMN } from 'config/data-table-column';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import { messageApi, commonApi } from 'services';
import { pageChangeHeaderTitle, setLabel } from 'store/actions';
import styles from 'styles/pages/message-list.module.scss';
import { sortData, colTableConfig } from 'utils/';
import { getMessageList } from 'utils/label/';
import {
  SearchByColumn,
  SearchByKeyword,
  TableFooter,
  TableHeader,
  ToggleEditLabel,
  ToggleVisibilityColTable,
  TableWithConfig,
  ButtonPermission,
} from '../../components/UI/features';

import { Action } from '../../components/UI/Message/MessageList';

const codeTable = 'message.index';
// done

const ListMessagePage = (props) => {
  const { userConfig } = props;
  const router = useRouter();
  const dispatch = useDispatch();

  const [dataOnPage, setDataOnPage] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [columns, setColumns] = useState(MESSAGE_COLUMN);

  const [codeTable, setCodeTable] = useState('message.index');

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
  const [dataLabel, setDataLabel] = useState([]);
  const [messageLabel, setMessageLabel] = useState({});
  const [isReloadData, setIsReloadData] = useState(false);
  const [dataTable, setDataTable] = useState([]);

  // ------ end state --------

  const handlePopupUpdateMessage = (idMessage, isUpdate) => {
    if (isUpdate) {
      router.push(`/message/update/${idMessage}`);
    } else {
      router.push(`/message/${idMessage}`);
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

  useEffect(() => {
    const rs = sortData(orderBy, order, dataTable);
    setDataTable(rs);
  }, [order, orderBy]);

  useEffect(() => {
    if (dataLabel && dataLabel.length > 0) {
      const messageLabel = getMessageList(dataLabel);

      dispatch(pageChangeHeaderTitle(messageLabel.titlePage));
      dispatch(setLabel({ label: messageLabel }));
      setMessageLabel(messageLabel);
    }
  }, [dataLabel]);

  // getMessageLabel
  useEffect(() => {
    setPageLoading(true);
    async function getMessageLabel() {
      try {
        let response = await messageApi.getMessageLabel();
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
    getMessageLabel();
  }, []);

  useEffect(() => {
    async function fetchMessageList() {
      setTableLoading(true);
      try {
        let response = await messageApi.getMessageList({
          orderBy: orderBy,
          direction: order,
          perPage: rowsPerPage,
          page: page,
          searchAll: textSearch,
          // id: parseInt(colTableSearch.find((item) => item.key === 'id').value),
          // name: colTableSearch.find((item) => item.key === 'name').value,
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
    fetchMessageList();
  }, [isReloadData, page, rowsPerPage, order, orderBy]);

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
            name: 'name',
            value: '',
            key: 'name',
            isDisplay: userConfig.column_config.column_name,
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
        name: 'name',
        value: '',
        key: 'name',
        isDisplay: userConfig.column_config.column_name,
      },
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
                      label={messageLabel.tooltipSwitch}
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
                      label={messageLabel.tooltipSearch}
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
                      label={messageLabel.tooltipFilter}
                      typeFilter={typeFilter}
                      setTypeFilter={setTypeFilter}
                      handleSearchAndFilter={handleSearchAndFilter}
                    />
                    <ButtonPermission
                      component={ToggleVisibilityColTable}
                      permission={true}
                      columns={columns}
                      setColumns={setColumns}
                      languageLabel={messageLabel}
                      codeTable={codeTable}
                      userConfig={userConfig}
                      label={messageLabel.tooltipShowHideColumn}
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
                            languageLabel={messageLabel}
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
                                <TableRow hover role="checkbox" tabIndex={-1} key={`message-${row.id}`}>
                                  {columns.map((column) =>
                                    column.visibility && column.label === 'action' ? (
                                      <TableCell
                                        align="left"
                                        width="10%"
                                        className={styles.tableCell}
                                        key={`message-table-cell-${column.key}-${row.id}`}
                                      >
                                        <Action
                                          id={row.id}
                                          handlePopupUpdateMessage={handlePopupUpdateMessage}
                                          label={messageLabel}
                                        />
                                      </TableCell>
                                    ) : (
                                      column.visibility && (
                                        <TableCell
                                          align="left"
                                          width="10%"
                                          className={styles.tableCell}
                                          key={`message-table-cell-${column.key}-${row.id}`}
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
      </Container>
    </Fragment>
  );
};

export default withAuth(withLayout(() => <TableWithConfig CodeTable={codeTable} PageView={ListMessagePage} />));
