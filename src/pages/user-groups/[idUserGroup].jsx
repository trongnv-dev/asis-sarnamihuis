import { useRouter } from 'next/dist/client/router';
import { getUserGroupList } from 'utils/label/';
import { userGroupApi } from 'services';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from 'styles/pages/userGroup-list.module.scss';
import { Switch } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import { Container, Button, Spinner } from '@blueupcode/components';
import { CircularProgress, Typography } from '@mui/material';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import URL from 'config/api-url';

function ViewDetailUserGroupModal() {
  const router = useRouter();
  const { idUserGroup } = router.query;

  const [readOnly, setReadOnly] = useState(true);
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // closeTab
  const closeTab = () => {
    router.back();
  };

  // API - getItemUserGroup
  useEffect(() => {
    if (!idUserGroup) return;
    setLoading(true);
    const loadData = async () => {
      try {
        const res = await userGroupApi.getItemUserGroup(idUserGroup);
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  // API - getUserGroupLabel
  useEffect(() => {
    setPageLoading(true);
    const loadDataUserGroupLabel = async () => {
      try {
        const res = await userGroupApi.getUserGroupLabel();
        if (res.data && res.data.data) {
          const userGroupList = getUserGroupList(res.data.data);
          setDataLabel(userGroupList);
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
    loadDataUserGroupLabel();
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
                {/* id */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.idDetail?.name}</label>
                  <input className="form-control" defaultValue={data.id} readOnly={readOnly} />
                </div>
                {/* Group tile */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.groupTitleDetail?.name}</label>
                  <input className="form-control" defaultValue={data.groupTitle} readOnly={readOnly} />
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
                        {/* idTranslate */}
                        <input className="form-control" defaultValue={item.idTranslate} hidden />
                        {/* idLanguage */}
                        <input className="form-control" defaultValue={item.idLanguage} hidden />
                        {/* languageIcon */}
                        <input className="form-control" defaultValue={item.languageIcon} hidden />
                        <span>
                          <img src={URL.BASE_URL + item.languageIcon} alt="icon" className="mr-2" />
                          <label className="form-label">{item.languageCode}</label>
                        </span>
                        <div className="form-group">
                          <label className="form-label">{dataLabel.nameDetail?.name}</label>
                          <input className="form-control" type="text" defaultValue={item.name} readOnly={readOnly} />
                        </div>

                        <div className="form-group">
                          <label className="form-label">{dataLabel.descriptionDetail?.name}</label>
                          <input
                            className="form-control"
                            type="text"
                            defaultValue={item.description}
                            readOnly={readOnly}
                          />
                        </div>
                      </li>
                    ))}
                  </div>
                </div>
                {/* IsActive */}
                <div className="form-group">
                  <label htmlFor="isActive">{dataLabel.isActiveDetail?.name}</label>
                  <Switch
                    id="isActive"
                    size="medium"
                    defaultChecked={data.isActive}
                    color="primary"
                    disabled={readOnly}
                  />
                </div>

                <div className="form-group" hidden>
                  <Switch id="isActiveAdmin" size="medium" defaultChecked={data.isActiveAdmin} color="primary" />
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

export default withAuth(withLayout(ViewDetailUserGroupModal));
