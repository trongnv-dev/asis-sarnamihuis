import { useRouter } from 'next/dist/client/router';
import { messageApi } from 'services';
import { getMessageList } from 'utils/label';
import styles from 'styles/pages/language-list.module.scss';
import { CircularProgress, Typography } from '@mui/material';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Container, Button } from '@blueupcode/components';
import { swal } from 'components/swal/instance';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import URL from 'config/api-url';

function ViewDetailMessageModal() {
  const router = useRouter();
  const { idMessage } = router.query;

  const [readOnly, setReadOnly] = useState(true);

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [dataLabel, setDataLabel] = useState([]);
  const [data, setData] = useState({});

  // Close tab
  const closeTab = () => {
    router.back();
  };

  // API - getItemMessage
  useEffect(() => {
    if (!idMessage) return;
    setLoading(true);
    const fetchItemMessage = async () => {
      try {
        const res = await messageApi.getItemMessage(idMessage);
        if (res.data && res.data?.data) {
          setData(res.data.data);
        } else {
          swal.fire({ text: res.statusText, icon: 'error' });
        }
      } catch (e) {
        console.log(e);
        swal.fire({ text: e, icon: 'error' });
      }
      setLoading(false);
    };
    fetchItemMessage();
  }, []);

  // API - getMessageLabel
  useEffect(() => {
    const fetchMessageLabel = async () => {
      try {
        const res = await messageApi.getMessageLabel();
        if (res.data && res.data?.data) {
          const messageLabel = getMessageList(res.data.data);
          setDataLabel(messageLabel);
        } else {
          swal.fire({ text: res.statusText, icon: 'error' });
        }
      } catch (e) {
        console.log(e);
        swal.fire({ text: e, icon: 'error' });
      }
      setPageLoading(false);
    };

    fetchMessageLabel();
  }, []);

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
            {data.id && (
              <form>
                {/* id */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.idDetail?.name}</label>
                  <input className="form-control" defaultValue={data.id} readOnly={readOnly} />
                </div>
                {/* code */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.codeDetail?.name}</label>
                  <input className="form-control" defaultValue={data.code} readOnly={readOnly} />
                </div>
                {/* translate */}
                <div className="form-group">
                  <label className="form-label">Translate</label>
                  <ul
                    className="list-group"
                    style={{
                      maxHeight: 200,
                      overflowY: 'scroll',
                    }}
                  >
                    {data.translate?.map((item) => (
                      <li className="list-group-item" key={item.idLanguage}>
                        <input className="form-control" defaultValue={item.id} hidden />
                        <input className="form-control" defaultValue={item.idLanguage} hidden />
                        <span>
                          <img src={`${URL.BASE_URL + item.icon}`} alt="icon" className="mr-2 mb-1" />
                          <label className="form-label">{item.nameLanguage}</label>
                        </span>
                        <input className="form-control" defaultValue={item.message} readOnly={readOnly} />
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Actions */}
                {/* <div className="form-group d-flex justify-content-end"> */}
                <div className="form-group">
                  <Button variant="outline-danger" type="button" onClick={closeTab}>
                    {dataLabel.btnBackDetail?.name}
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

export default withAuth(withLayout(ViewDetailMessageModal));
