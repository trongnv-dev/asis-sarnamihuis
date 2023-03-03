import { Fragment } from 'react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Container, Button, Spinner } from '@blueupcode/components';
import styles from 'styles/pages/country-list.module.scss';
import { CircularProgress, Typography } from '@mui/material';
import { Switch } from '@material-ui/core';

import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import { countryApi, languageApi } from 'services';
import { getCountryList } from 'utils/label';
import { swal } from 'components/swal/instance';
import { useRouter } from 'next/dist/client/router';

function ViewDetailCountryModal() {
  const router = useRouter();
  const countryId = router.query.countryId;

  const [readOnly, setReadOnly] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  const [data, setData] = useState({});
  const [dataLabel, setDataLabel] = useState([]);
  const [loading, setLoading] = useState(false);

  const closeTab = () => {
    router.back();
  };

  // API - getItemCountry
  useEffect(() => {
    if (!countryId) return;
    setLoading(true);
    const loadData = async () => {
      try {
        const res = await countryApi.getItemCountry(countryId);
        console.log(res);
        if (res.data && res.data.data) {
          setData(res.data.data);
        } else {
          swal.fire({
            text: res.statusText,
            icon: 'error',
          });
        }
      } catch (e) {
        setLoading(false);
        swal.fire({ text: e, icon: 'error' });
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // API - getCountryLabel
  useEffect(() => {
    setPageLoading(true);
    const getDataCountryLabel = async () => {
      try {
        const res = await countryApi.getCountryLabel();
        if (res.status === 200) {
          const countryLabel = getCountryList(res.data?.data);
          setDataLabel(countryLabel);
        } else {
          swal.fire({
            text: res.statusText,
            icon: 'error',
          });
        }
      } catch (e) {
        setPageLoading(false);
        swal.fire({
          text: e,
          icon: 'error',
        });
      }
      setPageLoading(false);
    };
    getDataCountryLabel();
  }, []);

  return (
    <Fragment>
      <Head>
        <title>{dataLabel.titlePageDetail != undefined ? dataLabel.titlePageDetail.name : ''}</title>
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
                {/* Translate */}
                <div className="form-group">
                  <label className="form-label">Translate</label>
                  <div
                    className="list-group"
                    style={{
                      maxHeight: 240,
                      overflowY: 'scroll',
                    }}
                  >
                    {data.translate?.map((item, index) => (
                      <li className="list-group-item" key={item.idLanguage}>
                        <span>
                          <img src={item.languageIcon} alt={item.languageCode} className="mr-2" />
                          <label htmlFor={`country_${item.idLanguage}`} className="form-label">
                            {item.languageCode}
                          </label>
                        </span>
                        <input
                          id={`country_${item.idLanguage}`}
                          className="form-control"
                          type="text"
                          defaultValue={item.idLanguage}
                          hidden
                        />
                        <input
                          id={`country_${item.country}`}
                          className="form-control"
                          type="text"
                          defaultValue={item.country == null ? '' : item.country}
                          required
                          readOnly
                        />
                      </li>
                    ))}
                  </div>
                </div>
                {/* Sort */}
                <div className="form-group">
                  <label className="form-label" htmlFor="sort">
                    {dataLabel.sortDetail?.name}
                  </label>
                  <input
                    id="sort"
                    type="number"
                    className="form-control"
                    min={1}
                    max={50}
                    step={1}
                    defaultValue={data.sort}
                    readOnly
                  />
                </div>
                {/* active */}
                <div className="form-group">
                  <label htmlFor="isActive" className="form-label">
                    {dataLabel.isActiveDetail?.name}
                  </label>
                  <Switch id="isActive" color="primary" defaultChecked={data.isActive} disabled={readOnly} />
                </div>
                {/* actions */}
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

export default withAuth(withLayout(ViewDetailCountryModal));
