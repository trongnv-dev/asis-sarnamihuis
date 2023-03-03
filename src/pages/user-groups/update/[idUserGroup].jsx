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
import * as yup from 'yup';
import { yupResolver } from 'components/validation/yupResolver';
import { useForm } from 'react-hook-form';
import URL from 'config/api-url';

const schema = yup.object().shape({
  groupTitle: yup.string().required('Group title can not empty'),
  userGroup: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Group name can not empty'),
      description: yup.string().max(100, 'Description must be at most 10 characters'),
    })
  ),
});

function UpdateUserGroupModal() {
  const router = useRouter();
  const { idUserGroup } = router.query;

  const [readOnly, setReadOnly] = useState(true);
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Update userGroup
  const updateUserGroup = async (formData) => {
    setLoading(true);
    try {
      const res = await userGroupApi.editItemUserGroup({
        groupTitle: formData.groupTitle,
        id: formData.id,
        translate: formData.userGroup,
        isActive: formData.isActive,
        isActiveAdmin: formData.isActiveAdmin,
      });
      if (res.status === 200) {
        swal.fire({
          text: res.message,
          icon: 'success',
        });
      } else {
        swal.fire({
          text: res,
          icon: 'error',
        });
      }
    } catch (e) {
      setLoading(false);
      swal.fire({
        text: e,
        icon: 'error',
      });
    }
    setLoading(false);
  };

  // closeTab
  const closeTab = () => {
    router.back();
  };

  // Form
  const formOptions = {
    mode: 'all',
    resolver: yupResolver(schema),
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

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
        <title>{dataLabel.titlePageUpdate?.name}</title>
      </Head>
      <Container fluid>
        {pageLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : dataLabel.sortUpdate != undefined ? (
          <>
            {data.id && (
              <form onSubmit={handleSubmit(updateUserGroup)}>
                {/* id */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.idUpdate?.name}</label>
                  <input {...register('id')} className="form-control" defaultValue={data.id} readOnly={readOnly} />
                </div>
                {/* Group tile */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.groupTitleUpdate?.name}</label>
                  <input
                    {...register('groupTitle')}
                    className="form-control"
                    defaultValue={data.groupTitle}
                    readOnly={readOnly}
                  />
                  {errors['groupTitle'] && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors['groupTitle']?.message}
                    </div>
                  )}
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
                        <input
                          {...register(`userGroup.${index}.idTranslate`)}
                          className="form-control"
                          defaultValue={item.idTranslate}
                          hidden
                        />
                        {/* idLanguage */}
                        <input
                          {...register(`userGroup.${index}.idLanguage`)}
                          className="form-control"
                          defaultValue={item.idLanguage}
                          hidden
                        />
                        {/* languageIcon */}
                        <input
                          {...register(`userGroup.${index}.languageIcon`)}
                          className="form-control"
                          defaultValue={item.languageIcon}
                          hidden
                        />
                        <span>
                          <img src={URL.BASE_URL + item.languageIcon} alt="icon" className="mr-2" />
                          <label className="form-label">{item.languageCode}</label>
                        </span>
                        <div className="form-group">
                          <label htmlFor={`userGroup_${item.name}`} className="form-label">
                            {dataLabel.nameUpdate?.name}
                          </label>
                          <input
                            {...register(`userGroup.${index}.name`)}
                            className="form-control"
                            type="text"
                            defaultValue={item.name}
                          />
                          {errors[`userGroup[${index}].name`] && (
                            <div style={{ display: 'block' }} className="invalid-feedback">
                              {errors[`userGroup[${index}].name`]?.message}
                            </div>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor={`userGroup_${item.description}`} className="form-label">
                            {dataLabel.descriptionUpdate?.name}
                          </label>
                          <input
                            id={`userGroup_${item.description}`}
                            {...register(`userGroup.${index}.description`)}
                            className="form-control"
                            type="text"
                            defaultValue={item.description}
                          />
                          {errors[`userGroup[${index}].description`] && (
                            <div style={{ display: 'block' }} className="invalid-feedback">
                              {errors[`userGroup[${index}].description`]?.message}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </div>
                </div>
                {/* IsActive */}
                <div className="form-group">
                  <label htmlFor="isActive">{dataLabel.isActiveUpdate?.name}</label>
                  <Switch
                    id="isActive"
                    {...register('isActive')}
                    size="medium"
                    defaultChecked={data.isActive ? true : false}
                    color="primary"
                  />
                </div>

                <div className="form-group" hidden>
                  <Switch
                    id="isActiveAdmin"
                    {...register('isActiveAdmin')}
                    size="medium"
                    defaultChecked={data.isActiveAdmin ? true : false}
                    color="primary"
                  />
                </div>

                {/* actions button */}
                <div className="form-group">
                  <Button className="mr-2" type="button" variant="outline-danger" onClick={closeTab}>
                    {dataLabel.btnBackUpdate?.name || 'Back'}
                  </Button>
                  <Button type="submit" variant="primary">
                    {loading && <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />}
                    {dataLabel.btnSaveUpdate?.name}
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

export default withAuth(withLayout(UpdateUserGroupModal));
