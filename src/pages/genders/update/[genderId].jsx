import React, { Fragment, useEffect, useState } from 'react';
import { Container, Button, Spinner } from '@blueupcode/components';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import Head from 'next/head';
import styles from 'styles/pages/gender-list.module.scss';
import { Switch } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import { useForm } from 'react-hook-form';
import { genderApi } from 'services';
import { useRouter } from 'next/dist/client/router';
import * as yup from 'yup';
import { getGenderList } from 'utils/label/';
import { CircularProgress, Typography } from '@mui/material';

const UpdateGenderModal = () => {
  const [dataLabel, setDataLabel] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const router = useRouter();
  const { genderId } = router.query;

  const schema = yup.object().shape({
    sort: yup.number().min(1).max(50).typeError('you must specify a number'),
    gender: yup.array().of(
      yup.object().shape({
        name: yup.string().required(`gender name can't empty`),
      })
    ),
  });

  const formOptions = {
    mode: 'all',
    resolver: yupResolver(schema),
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  const updateGender = async (formData) => {
    setLoading(true);
    try {
      const res = await genderApi.editItemGender({
        id: formData.id,
        sort: formData.sort,
        translate: formData.gender,
        isActive: formData.isActive,
        isActiveAdmin: data.isActiveAdmin,
      });

      if (res.status === 200) {
        swal.fire({ text: res.statusText, icon: 'success' });
      } else {
        swal.fire({ text: res.statusText, icon: 'error' });
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
      swal.fire({ text: e, icon: 'error' });
    }
    setLoading(false);
  };

  const closeTab = () => {
    router.back();
  };

  // API - getGenderLabel
  useEffect(() => {
    setPageLoading(true);
    async function getGenderLabel() {
      try {
        const res = await genderApi.getGenderLabel();
        if (res.data && res.data.data) {
          const genderLabel = getGenderList(res.data.data);
          setDataLabel(genderLabel);
        } else {
          swal.fire({ text: res.statusText, icon: 'error' });
        }
      } catch (e) {
        swal.fire({ text: e, icon: 'error' });
        setPageLoading(false);
      }
      setPageLoading(false);
    }
    getGenderLabel();
  }, []);

  // API  - getItemGender
  useEffect(() => {
    if (!genderId) return;
    setLoading(true);
    const loadData = async () => {
      try {
        const res = await genderApi.getItemGender(genderId);
        if (res?.data && res.data?.data) {
          setData(res.data.data);
        }
      } catch (e) {
        console.log(e);
        swal.fire({ text: e, icon: 'error' });
        setLoading(false);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <Fragment>
      <Head>
        <title>{dataLabel.textTitleUpdate?.name}</title>
      </Head>
      <Container fluid>
        {pageLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : dataLabel.sortUpdate != undefined ? (
          <>
            {data.id && (
              <form onSubmit={handleSubmit(updateGender)}>
                {/* id */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.idUpdate.name}</label>
                  <input
                    id="id"
                    name="id"
                    {...register('id')}
                    type="text"
                    className="form-control"
                    defaultValue={data.id}
                    readOnly
                  />
                  {errors.id && (
                    <div style={{ display: 'block' }} className="invalid-feedback">
                      {errors.id?.message}
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
                    {data.translate?.map((item, index) => (
                      <li className="list-group-item" key={item.idLanguage}>
                        {/* idLanguage */}
                        <input
                          {...register(`gender.${index}.idLanguage`)}
                          type="text"
                          defaultValue={item.idLanguage}
                          hidden
                        />
                        <input
                          {...register(`gender.${index}.idTranslate`)}
                          type="text"
                          defaultValue={item.idTranslate}
                          hidden
                        />
                        <span>
                          <img src={item.languageIcon} alt="icon" className="mr-2" />
                        </span>
                        <input
                          {...register(`gender.${index}.name`)}
                          className="form-control"
                          type="text"
                          defaultValue={item.name}
                          required
                        />
                        {errors && errors[`gender[${index}].name`] && (
                          <div style={{ display: 'block' }} className="invalid-feedback">
                            {errors[`gender[${index}].name`]?.message}
                          </div>
                        )}
                      </li>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="sort" className="form-label">
                    {dataLabel.sortUpdate.name}
                  </label>
                  <input
                    id="sort"
                    name="sort"
                    {...register('sort')}
                    type="number"
                    className="form-control"
                    defaultValue={data.sort}
                    min={1}
                    max={50}
                    step={1}
                  />
                  {errors.sort && (
                    <div style={{ display: 'block' }} className="invalid-feedback">
                      {errors.sort?.message}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">{dataLabel.isActiveUpdate?.name}</label>
                  <Switch
                    id="isActive"
                    {...register('isActive')}
                    size="medium"
                    defaultChecked={data.isActive ? true : false}
                    color="primary"
                  />
                  {errors.isActive && (
                    <div style={{ display: 'block' }} className="invalid-feedback">
                      {errors.isActive?.message}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <Button type="button" variant="outline-danger" className="mr-2" onClick={closeTab}>
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
    </Fragment>
  );
};

export default withAuth(withLayout(UpdateGenderModal));
