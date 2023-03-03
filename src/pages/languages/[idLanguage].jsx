import { useRouter } from 'next/dist/client/router';
import { languageApi } from 'services';
import { getLanguageList } from 'utils/label';
import styles from 'styles/pages/language-list.module.scss';
import { CircularProgress, Typography } from '@mui/material';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Container, Button, Spinner } from '@blueupcode/components';
import { Switch } from '@material-ui/core';
import moment from 'moment';
import { swal } from 'components/swal/instance';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';

function ViewDetailLanguageModal() {
  const router = useRouter();
  const { idLanguage } = router.query;
  const [readOnly, setReadOnly] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});

  // Close tab
  const closeTab = () => {
    router.back();
  };

  // API - getLanguageLabel
  useEffect(() => {
    setPageLoading(true);
    const loadDataLabel = async () => {
      try {
        const res = await languageApi.getLanguageLabel();

        if (res.status === 200) {
          const languageLabel = getLanguageList(res.data.data);
          setDataLabel(languageLabel);
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
    loadDataLabel();
  }, []);

  // API - getItemLanguage
  useEffect(() => {
    if (!idLanguage) return;
    setLoading(true);
    const loadItemLanguage = async () => {
      try {
        const res = await languageApi.getItemLanguage(idLanguage);
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
      } catch (e) {
        setLoading(false);
        swal.fire({ text: e, icon: 'error' });
      }
      setLoading(false);
    };
    loadItemLanguage();
  }, []);

  return (
    <>
      <Head>
        <title>{dataLabel && dataLabel.textTitleDetail?.name}</title>
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
                {/* id */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.idDetail?.name}</label>
                  <input className="form-control" defaultValue={data.id} readOnly={readOnly} />
                </div>
                {/* translate */}
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
                      <li className="list-group-item" key={item.id}>
                        <input defaultValue={item.id} hidden />
                        <input defaultValue={item.idLanguage} hidden />
                        <span>
                          <img src={item.icon} alt={item.nameLanguage} className="mr-2" />
                          <label className="form-label">{item.nameLanguage}</label>
                        </span>
                        <input className="form-control" defaultValue={item.name} readOnly={readOnly} />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* code */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.codeDetail?.name}</label>
                  <input className="form-control" defaultValue={data.code} readOnly={readOnly} />
                </div>

                {/* culture */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.cultureDetail?.name}</label>
                  <input className="form-control" defaultValue={data.culture} readOnly={readOnly} />
                </div>

                {/* Date format  */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.dateFormatDetail?.name}</label>
                  <input
                    defaultValue={moment(data.dateFormat, 'DD/MM/YYYY').format('DD/MM/YYYY')}
                    className="form-control"
                    readOnly={readOnly}
                  />
                </div>

                {/* sort */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.sortDetail?.name}</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    step={1}
                    className="form-control"
                    defaultValue={data.sort}
                    readOnly={readOnly}
                  />
                </div>
                {/* icon */}
                <div className="form-group" hidden>
                  <label className="form-label">{dataLabel.iconDetail?.name}</label>
                  <input className="form-control" defaultValue={data.icon} readOnly={readOnly} />
                  <img src={data.icon} alt="icon" />
                </div>

                {/* active */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.isActiveDetail?.name}</label>
                  <Switch
                    size="medium"
                    color="primary"
                    defaultChecked={data.isActive ? true : false}
                    disabled={readOnly}
                  />
                </div>
                {/* actions button */}
                <div className="form-group">
                  <Button variant="outline-danger" type="button" className="mr-2" onClick={closeTab}>
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

export default withAuth(withLayout(ViewDetailLanguageModal));
