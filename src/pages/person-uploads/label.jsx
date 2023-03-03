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
import { PERSON_UPLOAD_LABEL_COLUMN } from 'config/data-table-column';
import Head from 'next/head';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { personUploadApi, commonApi } from 'services';
import { pageChangeHeaderTitle, setLabel } from 'store/actions';
import styles from 'styles/pages/person-upload-list.module.scss';
import { sortData, colTableConfig } from 'utils/';
import { getPersonUploadLabel } from 'utils/label/';
import {
  ExportData,
  ImportData,
  SearchByColumn,
  SearchByKeyword,
  TableFooter,
  TableHeader,
  ToggleEditLabel,
  ToggleVisibilityColTable,
  TableWithConfig,
} from '../../components/UI/features';
import { Action, UpdateLabelModal } from '../../components/UI/PersonUpload/PersonUploadLabel';
import { useRouter } from 'next/dist/client/router';

const codeTable = 'personUpload.label';
const PersonLabelPage = (props) => {
  const { userConfig } = props;
  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataOnPage, setDataOnPage] = React.useState([]);
  const [dataTableLoading, setDataTableLoading] = useState(false);
  const [isReloadData, setIsReloadData] = useState(false);
  const [columns, setColumns] = useState(PERSON_UPLOAD_LABEL_COLUMN);
  const router = useRouter();

  const [page, setPage] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('');
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');

  const [reloadSearch, setReloadSearch] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const [colTableSearch, setColTableSearch] = useState([
    { name: 'name', value: '', key: 'name' },
    { name: 'code', value: '', key: 'code' },
  ]);

  const dispatch = useDispatch();
  const [personUploadLabel, setPersonUploadLabel] = useState({});

  const render = () => {
    const limit = rowsPerPage;
    const start = (page - 1) * limit;
    const dataOnPage = dataTable.slice(start, start + limit);
    setDataOnPage(dataOnPage);
  };

  const handlePopupUpdate = (idLabel, tableName, sort, isUpdate) => {
    if (isUpdate) {
      router.push(`/person-uploads/label/update/${idLabel}`);
    } else {
      router.push(`/person-uploads/label/${idLabel}`);
    }
  };

  const handleReload = () => {
    setIsReloadData(!isReloadData);
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
    }
    if ((page != '' && userConfig.page != page) || (rowsPerPage != '' && userConfig.per_page != rowsPerPage)) {
      saveConfig();
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    render();
  }, [dataTable, page, rowsPerPage, columns]);

  useEffect(() => {
    const rs = sortData(orderBy, order, dataTable);
    setDataTable(rs);
  }, [order, orderBy]);

  useEffect(() => {
    if (data && data.length > 0) {
      const personUploadLabel = getPersonUploadLabel(data);
      dispatch(pageChangeHeaderTitle(personUploadLabel.titlePage));
      dispatch(setLabel({ label: personUploadLabel }));
      setPersonUploadLabel(personUploadLabel);
    }
  }, [data]);

  useEffect(() => {
    let newData = [...data];

    newData = newData.filter((item) => {
      let str = '';
      columns.forEach((element) => {
        str += `${item[element.key]}# `;
      });
      return str.toString().toLowerCase().includes(textSearch.toLowerCase());
    });

    colTableSearch.forEach((col) => {
      newData = newData.filter((data) => {
        return data[col.key].toString().toLowerCase().includes(col.value.toLowerCase());
      });
    });
    setDataTable(newData);
    setPage(1);
  }, [colTableSearch, reloadSearch, data, textSearch]);

  useEffect(() => {
    async function getPersonUploadLabel() {
      try {
        setDataTableLoading(true);
        let response = await personUploadApi.getPersonUploadLabel();
        if (response.status === 200) {
          const data = sortData('id', 'asc', response.data.data);
          setData(data);
          setDataTable(data);
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (error) {
        swal.fire({ text: error.message, icon: 'error' });
      }
      setDataTableLoading(false);
    }
    getPersonUploadLabel();
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Table | {PAGE.siteName}</title>
      </Head>
      <Container fluid>
        {dataTableLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : data && data.length > 0 ? (
          <Row>
            <Col md="12">
              <Portlet>
                <Portlet.Header>
                  <div className={styles.tableHeader}>
                    <ToggleEditLabel label={personUploadLabel.tooltipSwitch} />
                    <div className={`${styles.disabled}`}>
                      <ImportData label={personUploadLabel} api={personUploadApi.importDataLabel} handleReload={handleReload} />
                    </div>
                    <ExportData
                      label={personUploadLabel}
                      data={data}
                      dataFilter={dataTable}
                      dataOnPage={dataOnPage}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      columns={columns}
                      isPageLabel={true}
                    />
                    <SearchByKeyword
                      textSearch={textSearch}
                      setTextSearch={setTextSearch}
                      isReloadData={reloadSearch}
                      setIsReloadData={setReloadSearch}
                      setPage={setPage}
                      setRowsPerPage={setRowsPerPage}
                      label={personUploadLabel.tooltipSearch}
                    />
                    <SearchByColumn
                      colTableSearch={colTableSearch}
                      setColTableSearch={setColTableSearch}
                      setPage={setPage}
                      setRowsPerPage={setRowsPerPage}
                      isReloadData={isReloadData}
                      setIsReloadData={setIsReloadData}
                      label={personUploadLabel.tooltipFilter}
                    />
                    <ToggleVisibilityColTable
                      userConfig={userConfig}
                      columns={columns}
                      setColumns={setColumns}
                      languageLabel={personUploadLabel}
                      codeTable={codeTable}
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

                          <TableBody>
                            {dataOnPage.map((row, index) => (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={`label-table-cell-${row.code}-${index}`}
                              >
                                {columns.map((column) =>
                                  column.visibility && column.label === 'action' ? (
                                    <TableCell
                                      align="left"
                                      width="10px"
                                      className={styles.tableCell}
                                      key={`label-table-cell-${column.key}-${row.code}`}
                                    >
                                      <Action
                                        sort={row.sort}
                                        id={row.id}
                                        table={row.table}
                                        handlePopupUpdate={handlePopupUpdate}
                                        label={personUploadLabel}
                                      />
                                    </TableCell>
                                  ) : (
                                    column.visibility && (
                                      <TableCell
                                        align="left"
                                        className={styles.tableCell}
                                        key={`label-table-cell-${column.key}-${row.code}`}
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
                          totalItems={dataTable.length}
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
export default withAuth(withLayout(() => <TableWithConfig CodeTable={codeTable} PageView={PersonLabelPage} />));
