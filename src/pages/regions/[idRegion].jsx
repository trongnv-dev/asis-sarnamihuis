import Head from 'next/head';

import { swal } from 'components/swal/instance';

import { regionApi, languageApi } from 'services';
import { getRegionList } from 'utils/label';
import styles from 'styles/pages/region-list.module.scss';

import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import { useEffect, useState } from 'react';
import { Button, Container, Spinner } from '@blueupcode/components';
import { CircularProgress, Typography } from '@mui/material';
import { Switch } from '@material-ui/core';
import { useRouter } from 'next/dist/client/router';

function ViewDetailRegionListModal() {
  const [readOnly, setReadOnly] = useState(true);
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { idRegion } = router.query;

  // Close tab
  const closeTab = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
  };

  // API - getRegionLabel
  useEffect(() => {
    const fecthRegionLabel = async () => {
      try {
        const res = await regionApi.getRegionLabel();
        if (res.data && res.data?.data) {
          const regionLabel = getRegionList(res.data?.data);
          setDataLabel(regionLabel);
        } else {
          swal.fire({
            text: res.statusText,
            icon: 'error',
          });
        }
      } catch (e) {
        console.log(e);
        swal.fire({
          text: e,
          icon: 'error',
        });
        setPageLoading(false);
      }
      setPageLoading(false);
    };

    fecthRegionLabel();
  }, []);

  // API - getItemRegion
  useEffect(() => {
    if (!idRegion) return;

    setLoading(true);
    const fecthData = async () => {
      try {
        const res = await regionApi.getItemRegion(idRegion);
        if (res.data && res.data?.data) {
          setData(res.data?.data);
        } else {
          swal.fire({
            text: res.statusText,
            icon: 'error',
          });
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
        swal.fire({
          text: e,
          icon: 'error',
        });
      }
      setLoading(false);
    };
    fecthData();
  }, []);

  return (
    <>
      <Head>
        <title>{dataLabel.titlePageDetail?.name}</title>
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
                {/* CountryID */}
                <div className="form-group">
                  <label htmlFor="country" className="form-label">
                    Country Id
                  </label>
                  <input id="country" className="form-control" readOnly={readOnly} defaultValue="" />
                </div>
                {/* Perant Id */}
                <div className="form-group">
                  <label htmlFor="parentId" className="form-label">
                    Parent Id
                  </label>
                  <input id="parentId" className="form-control" readOnly={readOnly} defaultValue="" />
                </div>
                {/* Id */}
                <div className="form-group">
                  <label htmlFor="id" className="form-label">
                    {dataLabel.idDetail?.name}
                  </label>
                  <input id="id" className="form-control" readOnly={readOnly} defaultValue={data.id} />
                </div>
                {/* Translate */}
                <div className="form-group">
                  <label className="form-label">Translate</label>
                  <ul
                    className="list-group"
                    style={{
                      maxHeight: 240,
                      overflowY: 'scroll',
                    }}
                  >
                    {data.translate?.map((item, index) => (
                      <li key={item.idLanguage} className="list-group-item">
                        <span>
                          <img src={item.languageIcon} alt="icon" className="mr-2 mb-1" />
                          <label className="form-label">{item.nameLanguage}</label>
                        </span>
                        <input className="form-control" defaultValue={item.region} readOnly={readOnly} />
                      </li>
                    ))}
                  </ul>
                </div>
                {/* sort */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.sortDetail?.name}</label>
                  <input
                    type="number"
                    className="form-control"
                    min={1}
                    max={50}
                    step={1}
                    defaultValue={data.sort}
                    readOnly={readOnly}
                  />
                </div>
                {/* isActive */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.isActiveDetail?.name}</label>
                  <Switch
                    size="medium"
                    color="primary"
                    defaultChecked={data.isActive ? true : false}
                    disabled={readOnly}
                  />
                </div>
                {/* action buttons */}
                <div className="from-group d-flex justify-content-end mb-3">
                  <Button type="button" variant="outline-danger" onClick={closeTab}>
                    {dataLabel.btnCloseDetail?.name}
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
    </>
  );
}

export default withAuth(withLayout(ViewDetailRegionListModal));
