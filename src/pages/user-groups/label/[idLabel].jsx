import { useRouter } from 'next/dist/client/router';
import { getUserGroupLabel } from 'utils/label/';
import { userGroupApi } from 'services';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from 'styles/pages/userGroup-list.module.scss';
import { swal } from 'components/swal/instance';
import { Container, Button, Spinner } from '@blueupcode/components';
import { CircularProgress, Typography } from '@mui/material';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import URL from 'config/api-url';

function ViewDetailLabelUserGroupModal() {
  const router = useRouter();
  const { idLabel } = router.query;

  const [readOnly, setReadOnly] = useState(true);
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const id = Number(idLabel);
  const table = dataLabel.action?.table;
  const sort = Number(dataLabel.action?.sort);

  // Close tab
  const closeTab = () => {
    router.back();
  };

  // API - getUserGroupLabel
  useEffect(() => {
    setPageLoading(true);
    const loadDataLanguageLabel = async () => {
      try {
        const res = await userGroupApi.getUserGroupLabel();
        if (res.data && res.data.data) {
          const userGroupLabel = getUserGroupLabel(res.data.data);
          setDataLabel(userGroupLabel);
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

  // API - getItemUserGroupLabel
  useEffect(() => {
    if (!table) return;
    setLoading(true);
    const loadData = async () => {
      try {
        const res = await userGroupApi.getItemUserGroupLabel({ id, tableName: table });
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
        ) : dataLabel.sortUpdate != undefined ? (
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
                    {data.translate?.map((item, index) => (
                      <li className="list-group-item" key={item.idLanguage}>
                        <span>
                          <img src={URL.BASE_URL + item.icon} alt="icon" className="mr-2" />
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

export default withAuth(withLayout(ViewDetailLabelUserGroupModal));
