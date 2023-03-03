import { Col, Container, Portlet, Row } from '@blueupcode/components';
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import Head from 'next/head';
import styles from 'styles/pages/gender-list.module.scss';

import { Button, Modal, Spinner } from '@blueupcode/components';
import { Switch } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useForm } from 'react-hook-form';
import { genderApi, languageApi } from 'services';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { getGenderList } from 'utils/label/';

const schema = yup.object().shape({
  sort: yup.number().min(1).max(50).typeError('you must specify a number'),

  gender: yup.array().of(
    yup.object().shape({
      name: yup.string().required(`gender name can't empty`),
    })
  ),
});

const CreateGenderModal = (props) => {
  const router = useRouter();

  const [dataLabel, setDataLabel] = useState([]);
  const isSwitch = useSelector((state) => state.page.isQuickEdit);
  const [pageLoading, setPageLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const closeTab = () => {
    router.back();
  };

  const resetForm = () => {
    reset();
  };

  useEffect(() => {
    setPageLoading(true);
    async function getGenderLabel() {
      try {
        let response = await genderApi.getGenderLabel();
        if (response.status === 200) {
          const genderLabel = getGenderList(response.data.data);
          setDataLabel(genderLabel);
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (error) {
        swal.fire({ text: error.message, icon: 'error' });
      }
      setPageLoading(false);
    }
    getGenderLabel();
  }, []);

  const formOptions = { mode: 'all', resolver: yupResolver(schema) };

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  // CreateGender
  const createGender = async (formData) => {
    setLoading(true);
    try {
      const res = await genderApi.createItemGender({
        sort: formData.sort,
        gender: formData.gender,
        isActive: formData.isActive,
      });

      if (res.status == 200) {
        await swal.fire({ text: res.data.update, icon: 'success' });
        resetForm();
      } else {
        swal.fire({ text: res.statusText, icon: 'error' });
      }
    } catch (e) {
      console.log(e);
      swal.fire({ e, icon: 'error' });
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let response = await languageApi.getCurrentLanguageList();
        if (response.status === 200) {
          const array = Object.keys(response.data.listLanguageActive).map(function (key) {
            return response.data.listLanguageActive[key];
          });
          let genderData = array.map((item) => {
            return {
              idLanguage: item.idLanguage,
              nameLanguage: item.name,
              iconLanguage: item.icon,
            };
          });

          let dataValue = {
            sort: 50,
            gender: genderData,
          };
          setData(dataValue);
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <Fragment>
      <Head>
        <title>{dataLabel.textTitleCreate?.name}</title>
      </Head>
      <Container fluid>
        {pageLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : dataLabel.sortCreate != undefined ? (
          <form onSubmit={handleSubmit(createGender)}>
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
                {data.gender?.map((item, index) => (
                  <li className="list-group-item" key={item.idLanguage}>
                    <span>
                      <img src={item.iconLanguage} alt="icon" className="mr-2" />
                      <label for={`gender_${item.idLanguage}`} className="form-label">
                        {item.nameLanguage}
                      </label>
                    </span>
                    <input
                      id={`gender_${item.idLanguage}`}
                      {...register(`gender.${index}.idLanguage`)}
                      className="form-control"
                      type="text"
                      defaultValue={item.idLanguage}
                      hidden
                    />
                    <input
                      id={`gender_${item.name}`}
                      {...register(`gender.${index}.name`)}
                      className="form-control"
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
              <label for="sort" className="form-label">
                {dataLabel.sortCreate.name}
              </label>
              <input
                id="sort"
                name="sort"
                {...register('sort')}
                type="number"
                className="form-control"
                defaultValue={50}
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
              <label for="isActive" className="form-label">
                {dataLabel.isActiveCreate?.name}
              </label>
              <Switch id="isActive" {...register('isActive')} size="medium" color="primary" />
              {errors.isActive && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.isActive?.message}
                </div>
              )}
            </div>
            <div className="form-group">
              <Button type="button" variant="outline-danger" className="mr-2" onClick={closeTab}>
                {dataLabel.btnBackCreate?.name || 'Back'}
              </Button>
              <Button type="submit" variant="primary">
                {loading && <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />}
                {dataLabel.btnCreate?.name}
              </Button>
            </div>
          </form>
        ) : (
          <Typography align="center" className={styles.noData}>
            There are no labels to display
          </Typography>
        )}
      </Container>
    </Fragment>
  );
};

export default withAuth(withLayout(CreateGenderModal));
