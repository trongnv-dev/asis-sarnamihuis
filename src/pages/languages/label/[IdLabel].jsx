import { useRouter } from 'next/dist/client/router';
import { getLanguageLabel } from 'utils/label/';
import { languageApi } from 'services';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from 'styles/pages/language-list.module.scss';
import { swal } from 'components/swal/instance';
import { Container, Button, Spinner } from '@blueupcode/components';
import { CircularProgress, Typography } from '@mui/material';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import URL from 'config/api-url';

function ViewDetailLabelLanguageModal() {
  const router = useRouter();
  const { IdLabel } = router.query;

  const [readOnly, setReadOnly] = useState(true);
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const id = Number(IdLabel);
  const table = dataLabel.action?.table;
  const sort = Number(dataLabel.action?.sort);

  // Close tab
  const closeTab = () => {
    router.back();
  };

  // API - getLanguageLabel
  useEffect(() => {
    setPageLoading(true);
    const loadDataLanguageLabel = async () => {
      try {
        const res = await languageApi.getLanguageLabel();
        if (res.data && res.data.data) {
          const languageLabel = getLanguageLabel(res.data.data);
          setDataLabel(languageLabel);
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
    loadDataLanguageLabel();
  }, []);

  // API - getItemLanguageLabel
  useEffect(() => {
    if (!table) return;
    setLoading(true);
    const loadData = async () => {
      try {
        const res = await languageApi.getItemLanguageLabel({ id, tableName: table });
        if (res.data) {
          const tmp = {
            idLabel: id,
            sort: sort,
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
    loadData();
  }, [table]);

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
                          <img
                            src={item.icon?.includes('https') ? item.icon : `${URL.BASE_URL + item.icon}`}
                            alt="icon"
                            className="mr-2"
                          />
                        </span>
                        <input className="form-control" defaultValue={item.idLanguage} hidden />
                        <input className="form-control" defaultValue={item.label} readOnly={readOnly} />
                      </li>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="form-group">
                  <label className="form-label" htmlFor="sort">
                    {dataLabel.sortUpdate?.name}
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
                <div className="form-group">
                  <Button className="mr-2" type="button" variant="outline-danger" onClick={closeTab}>
                    {dataLabel.btnBackUpdate?.name || 'Back'}
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

export default withAuth(withLayout(ViewDetailLabelLanguageModal));
