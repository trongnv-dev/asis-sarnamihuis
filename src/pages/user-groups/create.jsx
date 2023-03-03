import { getUserGroupList } from 'utils/label/';
import { userGroupApi, languageApi } from 'services';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
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
      description: yup.string().max(100, 'Description must be at most 100 characters'),
    })
  ),
});

function CreateUserGroupModal() {
  const router = useRouter();

  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // closeTab
  const closeTab = () => {
    router.back();
  };

  const resetForm = () => {
    reset();
  };

  // Form
  const formOptions = {
    mode: 'all',
    resolver: yupResolver(schema),
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(formOptions);

  // Create user-group
  const createUserGroup = async (formData) => {
    setLoading(true);
    try {
      const res = await userGroupApi.createItemUserGroup({
        groupTitle: formData.groupTitle,
        translate: formData.userGroup,
        isActive: formData.isActive,
      });
      if (res.status === 200) {
        await swal.fire({
          text: res.message,
          icon: 'success',
        });
        resetForm();
      } else {
        swal.fire({
          text: res.message,
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

  // API - getCurrentLanguageList
  useEffect(() => {
    setLoading(true);
    async function loadData() {
      try {
        const response = await languageApi.getCurrentLanguageList();
        if (response.status === 200) {
          const array = Object.values(response.data.listLanguageActive).map((key) => key);
          const userGroupData = array.map((item) => ({
            idLanguage: item.idLanguage,
            nameLanguage: item.name,
            iconLanguage: item.icon,
          }));

          setData({
            userGroup: userGroupData,
          });
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <>
      <Head>
        <title>{dataLabel.titlePageCreate?.name}</title>
      </Head>
      <Container fluid>
        {pageLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : dataLabel.sortCreate != undefined ? (
          <form onSubmit={handleSubmit(createUserGroup)}>
            <div className="form-group">
              <label htmlFor="groupTitle" className="form-label">
                {dataLabel.groupTitleCreate.name}
              </label>
              <input
                id="groupTitle"
                name="groupTitle"
                {...register('groupTitle')}
                type="text"
                className="form-control"
              />
              {errors.groupTitle && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.groupTitle.message}
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Translate</label>
              <div
                className="list-group"
                style={{
                  maxHeight: 240,
                  overflowY: 'scroll',
                  scrollbarWidth: 'thin',
                }}
              >
                {data.userGroup &&
                  data.userGroup.map((item, index) => (
                    <li className="list-group-item" key={item.idLanguage}>
                      <span>
                        <img src={item.iconLanguage} alt="icon" className="mr-2" />

                        <label htmlFor={`userGroup_${item.idLanguage}`} className="form-label">
                          {item.nameLanguage}
                        </label>
                      </span>
                      <input
                        id={`userGroup_${item.idLanguage}`}
                        {...register(`userGroup.${index}.idLanguage`)}
                        className="form-control"
                        type="text"
                        defaultValue={item.idLanguage}
                        hidden
                      />
                      <div className="form-group">
                        <label htmlFor={`userGroup_${item.name}`} className="form-label">
                          {dataLabel.nameCreate.name}
                        </label>
                        <input
                          id={`userGroup_${item.name}`}
                          {...register(`userGroup.${index}.name`)}
                          className="form-control"
                          type="text"
                          required
                        />
                        {errors && errors[`userGroup[${index}].name`] && (
                          <div style={{ display: 'block' }} className="invalid-feedback">
                            {errors[`userGroup[${index}].name`]?.message}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor={`userGroup_${item.description}`} className="form-label">
                          {dataLabel.descriptionCreate.name}
                        </label>
                        <input
                          id={`userGroup_${item.description}`}
                          {...register(`userGroup.${index}.description`)}
                          className="form-control"
                          type="text"
                        />
                        {errors && errors[`userGroup[${index}].description`] && (
                          <div style={{ display: 'block' }} className="invalid-feedback">
                            {errors[`userGroup[${index}].description`]?.message}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="isActive" className="form-label">
                {dataLabel.isActiveCreate.name}
              </label>
              <Switch id="isActive" {...register('isActive')} size="medium" color="primary" />
            </div>

            <div className="form-group">
              <Button className="mr-2" type="button" variant="outline-danger" onClick={closeTab}>
                {dataLabel.btnBackCreate?.name || 'Back'}
              </Button>
              <Button type="submit" variant="primary">
                {loading && <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />}
                {dataLabel.btnSaveCreate?.name}
              </Button>
            </div>
          </form>
        ) : (
          <Typography align="center" className={styles.noData}>
            There are no labels to display
          </Typography>
        )}
      </Container>
    </>
  );
}

export default withAuth(withLayout(CreateUserGroupModal));
