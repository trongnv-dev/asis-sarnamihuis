import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Container, Button } from '@blueupcode/components';
import { CircularProgress, Typography } from '@mui/material';
import { Switch } from '@material-ui/core';
import { useRouter } from 'next/dist/client/router';

import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import { genderApi } from 'services';
import { getGenderList } from 'utils/label';
import { swal } from 'components/swal/instance';
import styles from 'styles/pages/gender-list.module.scss';

function ViewDetailGenderModal() {
  const router = useRouter();
  const { genderId } = router.query;

  const [readOnly, setReadOnly] = useState(true);
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeTab = () => {
    router.back();
  };

  // APT - getGenderLabel
  useEffect(() => {
    setPageLoading(true);
    async function getGenderLabel() {
      try {
        let response = await genderApi.getGenderLabel();
        if (response.status === 200) {
          const genderLabel = getGenderList(response.data.data);
          setDataLabel(genderLabel);
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (e) {
        swal.fire({ text: response.statusText, icon: 'error' });
      }
      setPageLoading(false);
    }
    getGenderLabel();
  }, []);

  // API - getItemGender
  useEffect(() => {
    if (!genderId) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await genderApi.getItemGender(genderId);
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
        <title>{dataLabel.textTitleDetail?.name}</title>
      </Head>
      <Container fluid>
        {pageLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : dataLabel.sortDetail != undefined ? (
          <>
            {data.id && (
              <form>
                <div className="form-group">
                  <label className="form-label">{dataLabel.idDetail.name}</label>
                  <input
                    id="id"
                    name="id"
                    className="form-control"
                    type="text"
                    defaultValue={data.id}
                    readOnly={readOnly}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Translate</label>
                  <div
                    className="list-group"
                    style={{
                      maxHeight: 240,
                      overflowY: 'scroll',
                    }}
                  >
                    {data.translate?.map((item) => (
                      <li className="list-group-item" key={item.idLanguage}>
                        <span>
                          <img src={item.languageIcon} alt="icon" />
                        </span>
                        <input className="form-control" type="text" defaultValue={item.name} readOnly={readOnly} />
                      </li>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">{dataLabel.sortDetail?.name}</label>
                  <input
                    id="sort"
                    name="sort"
                    type="number"
                    className="form-control"
                    defaultValue={data.sort}
                    min={1}
                    max={50}
                    step={1}
                    readOnly={readOnly}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{dataLabel.isActiveDetail?.name}</label>
                  <Switch size="medium" defaultChecked={data.isActive} color="primary" disabled={readOnly} />
                </div>
                <div className="from-group">
                  <Button type="button" className="mr-2" variant="outline-danger" onClick={closeTab}>
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

export default withAuth(withLayout(ViewDetailGenderModal));
