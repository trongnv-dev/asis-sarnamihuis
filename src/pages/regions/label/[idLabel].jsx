import { useRouter } from 'next/dist/client/router';
import { getRegionLabel } from 'utils/label/';
import { regionApi } from 'services';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from 'styles/pages/region-list.module.scss';
import { swal } from 'components/swal/instance';
import { Container, Button, Spinner } from '@blueupcode/components';
import { CircularProgress, Typography } from '@mui/material';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import URL from 'config/api-url';

function ViewDetailLabelRegionModal() {
  const [readOnly, setReadOnly] = useState(true);
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { idLabel } = router.query;
  const tableName = dataLabel.action?.table;

  // Close tab
  const closeTab = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
  };

  // API - getRegionLabel
  useEffect(() => {
    const fetchRegionLabel = async () => {
      try {
        const res = await regionApi.getRegionLabel();
        if (res.data && res.data.data) {
          const regionLabel = getRegionLabel(res.data.data);
          setDataLabel(regionLabel);
        } else {
          swal.fire({
            text: res.statusText,
            icon: 'error',
          });
        }
      } catch (e) {
        swal.fire({
          text: e,
          icon: 'error',
        });
        setPageLoading(false);
      }
      setPageLoading(false);
    };
    fetchRegionLabel();
  }, []);

  // API - getItemRegionLabel
  useEffect(() => {
    if (!idLabel) return;
    if (!tableName) return;

    setLoading(true);
    const fecthData = async () => {
      try {
        const res = await regionApi.getItemRegionLabel({
          id: idLabel,
          tableName: tableName,
        });
        if (res.data) {
          const tmp = {
            idLabel: idLabel,
            sort: 50,
            translate: res.data,
          };
          setData(tmp);
        } else {
          swal.fire({
            text: res.statusText,
            icon: 'error',
          });
        }
      } catch (e) {
        swal.fire({
          text: e,
          icon: 'error',
        });
        setLoading(false);
      }
      setLoading(false);
    };
    fecthData();
  }, [tableName, idLabel]);

  return (
    <>
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
            {data.idLabel && (
              <form>
                {/* id */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.idDetail?.name}</label>
                  <input className="form-control" defaultValue={data.idLabel} readOnly={readOnly} />
                </div>

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
                    {data.translate?.map((item) => (
                      <li className="list-group-item" key={item.idLanguage}>
                        <span>
                          <img src={URL.BASE_URL + item.icon} alt="icon" className="mr-2" />
                        </span>
                        <input className="form-control" defaultValue={item.label} readOnly={readOnly} />
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
                    readOnly={readOnly}
                  />
                </div>

                {/* actions button */}
                <div className="form-group d-flex justify-content-end">
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

export default withAuth(withLayout(ViewDetailLabelRegionModal));
