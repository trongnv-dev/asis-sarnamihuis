import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { swal } from 'components/swal/instance';
import { Container, Button, Spinner } from '@blueupcode/components';
import { CircularProgress, Typography } from '@mui/material';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import URL from 'config/api-url';
import { getPersonUploadLabel } from 'utils/label/';
import { personUploadApi } from 'services';
import styles from 'styles/pages/person-upload-list.module.scss';

function ViewDetailLabelPersonUploadModal() {
  const [readOnly, setReadOnly] = useState(true);
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { idLabel } = router.query;
  const tableName = dataLabel.action?.table;

  // Close tab
  const closeTab = () => {
    router.back();
  };

  // API - getPersonUploadLabel
  useEffect(() => {
    setPageLoading(true);
    const getDataPersonUploadLabel = async () => {
      try {
        const res = await personUploadApi.getPersonUploadLabel();
        if (res.data && res.data.data) {
          const dataPersonUploadLabel = getPersonUploadLabel(res.data.data);
          setDataLabel(dataPersonUploadLabel);
        }
      } catch (e) {
        console.log(e);
        setPageLoading(false);
      }
      setPageLoading(false);
    };
    getDataPersonUploadLabel();
  }, []);

  // API - getItemPersonUploadLabel
  useEffect(() => {
    if (!tableName) return;
    setLoading(true);
    const loadData = async () => {
      try {
        const res = await personUploadApi.getItemPersonUploadLabel({
          id: idLabel,
          tableName: tableName,
        });
        if (res.data) {
          const temp = {
            idLabel: idLabel,
            sort: 50,
            translate: res.data,
          };
          setData(temp);
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
        setLoading(false);
      }
      setLoading(false);
    };

    loadData();
  }, [tableName]);

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
                  <label className="form-label">{dataLabel.idUpdate?.name}</label>
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
                    {data.translate?.map((item, index) => (
                      <li className="list-group-item" key={item.idLanguage}>
                        <span>
                          <img src={URL.BASE_URL + item.icon} alt="icon" />
                        </span>
                        <input className="form-control" defaultValue={item.idLanguage} hidden />
                        <input className="form-control" defaultValue={item.label} readOnly={readOnly} />
                      </li>
                    ))}
                  </div>
                </div>

                {/* sort */}
                <div className="form-group">
                  <label htmlFor="sort" className="form-label">
                    {dataLabel.sortDetail?.name}
                  </label>
                  <input
                    id="sort"
                    className="form-control"
                    defaultValue={data.sort}
                    type="number"
                    min={1}
                    max={50}
                    step={1}
                    readOnly={readOnly}
                  />
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
    </>
  );
}

export default withAuth(withLayout(ViewDetailLabelPersonUploadModal));
