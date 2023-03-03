import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Container, Button } from '@blueupcode/components';
import { CircularProgress, Typography } from '@mui/material';
import { Switch } from '@material-ui/core';
import { useRouter } from 'next/dist/client/router';

import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import { sysAttSubApi } from 'services';
import { getSysAttSubList } from 'utils/label';
import { swal } from 'components/swal/instance';
import styles from 'styles/pages/sys-att-sub-list.module.scss';

function ViewDetailSysAttSubModal() {
  const readOnly = true;
  const router = useRouter();
  const sysAttSubId = router.query.sysAttSubId;

  const [dataLabel, setDataLabel] = useState([]);
  const [data, setData] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeTab = () => {
    router.back();
  };

  useEffect(() => {
    setPageLoading(true);
    async function getSysAttSubLabel() {
      try {
        let response = await sysAttSubApi.getSysAttSubLabel();
        if (response.status === 200) {
          const sysAttSubLabel = getSysAttSubList(response.data.data);
          setDataLabel(sysAttSubLabel);
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (e) {
        swal.fire({ text: response.statusText, icon: 'error' });
      }
      setPageLoading(false);
    }
    getSysAttSubLabel();
  }, []);

  useEffect(() => {
    if (!sysAttSubId) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await sysAttSubApi.getItemSysAttSub(sysAttSubId);
        if (res?.data && res.data?.data) {
          setData(res.data.data);
        }
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <Fragment>
      <Head>
        <title>{dataLabel.textTitleDetail != undefined ? dataLabel.textTitleDetail.name : ''}</title>
      </Head>
      <Container fluid>
        {pageLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : dataLabel.sortDetail != undefined ? (
          <>
            {loading && (
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}

            {data.id && (
              <form>
                <div className="form-group">
                  <label className="form-label">{dataLabel.idDetail.name}</label>
                  <input id="id" name="id" className="form-control" type="text" defaultValue={data.id} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Code</label>
                  <input  className="form-control" defaultValue={data.code} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Translate</label>
                  <div
                    className="list-group"
                    style={{
                      maxHeight: 240,
                      overflowY: 'scroll',
                      scrollbarWidth: 'thin',
                    }}
                  >
                    {data.translate?.map((item) => (
                      <li className="list-group-item">
                        <span>
                          <img src={item.languageIcon} alt="icon" />
                        </span>
                        <input id="" className="form-control" type="text" defaultValue={item.name} readOnly />
                      </li>
                    ))}
                  </div>
                </div>
                
                <div className="form-group">
                  <label for="" className="form-label">
                  {dataLabel.isEditDetail.name}
                  </label>
                  <Switch id="isEdit" size="lg" defaultChecked={data.isEdit} color="primary" disabled />
                </div>
                {/* Button action */}
                <div className="form-group">
                  <Button className="mr-2" type="button" variant="outline-danger" onClick={closeTab}>
                    {dataLabel.btnBackDetail?.name || 'Back'}
                  </Button>
                </div>
              </form>
            )}
          </>
        ) : (
          <Typography align="center" className={styles.noData}>
            There are no labels to display
          </Typography>
        )}
      </Container>
    </Fragment>
  );
}

export default withAuth(withLayout(ViewDetailSysAttSubModal));
