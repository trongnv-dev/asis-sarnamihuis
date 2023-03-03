import { Container } from '@blueupcode/components';
import {
  CircularProgress,
  Typography,
} from '@mui/material';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import Head from 'next/head';
import styles from 'styles/pages/sys-att-sub-list.module.scss';

import { Button, Modal, Spinner } from '@blueupcode/components';
import { Switch } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { sysAttSubApi, languageApi } from 'services';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { getSysAttSubList } from 'utils/label/';
import { useRouter } from 'next/dist/client/router';

const CreateSysAttSubModal = (props) => {
  const [dataLabel, setDataLabel] = useState([]);
  const isSwitch = useSelector((state) => state.page.isQuickEdit);
  const [pageLoading, setPageLoading] = useState(false);
  const router = useRouter();
  const { sysAttMainId } = router.query;

  const schema = yup.object().shape({
    code: yup.string().required(`Code can't empty`),
    sysAttSub: yup.array().of(
      yup.object().shape({
        name: yup.string().required(`sysAttSub name can't empty`),
      })
    ),
  });

  const closeTab = () => {
    router.back();
  };

  useEffect(() => {
    setPageLoading(true);
    async function getSysAttSubLabel() {
      try {
        let response = await sysAttSubApi.getSysAttSubLabel();
        if (response.status === 200) {
          const sysAttSubLabel = getSysAttSubList(response.data.data);
          setDataLabel(sysAttSubLabel);
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (error) {
        swal.fire({ text: error.message, icon: 'error' });
      }
      setPageLoading(false);
    }
    getSysAttSubLabel();
  }, []);

  const formOptions = { resolver: yupResolver(schema) };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const createSysAttSub = async (formData) => {
    setLoading(true);
    try {
      const res = await sysAttSubApi.createItemSysAttSub({
        attSub: formData.sysAttSub,
        is_edit: formData.isActive === true ? 1 : 0,
        id_sysatt_main: sysAttMainId,
        code: formData.code
      });

      if (res.status == 200) {
        await swal.fire({ text: res.data.update, icon: 'success' });
        closeTab();
      } else {
        swal.fire({ text: 'network error', icon: 'error' });
      }
    } catch (e) {
      console.log(e);
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
          var array = Object.keys(response.data.listLanguageActive).map(function (key) {
            return response.data.listLanguageActive[key];
          });
          let sysAttSubData = array.map((item) => {
            return {
              idLanguage: item.idLanguage,
              nameLanguage: item.name,
              iconLanguage: item.icon,
            };
          });

          let dataValue = {
            sysAttSub: sysAttSubData,
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
        <title>{dataLabel.textTitleCreate != undefined ? dataLabel.textTitleCreate.name : ''}</title>
      </Head>
      <Container fluid>
        {pageLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : dataLabel.btnSaveCreate != undefined ? (
          <form onSubmit={handleSubmit(createSysAttSub)}>
            <div className="form-group">
              <label className="form-label">Code</label>
              <input {...register('code')} className="form-control" />
              {errors.code && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.code?.message}
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
                {data.sysAttSub &&
                  data.sysAttSub.map((item, index) => (
                    <li className="list-group-item">
                      <span>
                        <img src={item.iconLanguage} alt="icon" />
                        {'	'}
                        <label for={`sysAttSub_${item.idLanguage}`} className="form-label">
                          {item.nameLanguage}
                        </label>
                      </span>
                      <input
                        id={`sysAttSub_${item.idLanguage}`}
                        {...register(`sysAttSub.${index}.idLanguage`)}
                        className="form-control"
                        type="text"
                        defaultValue={item.idLanguage}
                        hidden
                      />
                      <input
                        id={`sysAttSub_${item.name}`}
                        {...register(`sysAttSub.${index}.name`)}
                        className="form-control"
                        type="text"
                        defaultValue={item.name == null ? '' : item.name}
                        required
                      />
                      {errors && errors[`sysAttSub[${index}].name`] && (
                        <div style={{ display: 'block' }} className="invalid-feedback">
                          {errors[`sysAttSub[${index}].name`]?.message}
                        </div>
                      )}
                    </li>
                  ))}
              </div>
            </div>
            <div className="form-group">
              <label for="isActive" className="form-label">
                {/* {dataLabel.isActiveCreate.name} */}
                is Edit
              </label>
              <Switch
                id="isActive"
                {...register('isActive')}
                size="lg"
                defaultChecked={data.isActive}
                color="primary"
              />
              {errors.isActive && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.isActive?.message}
                </div>
              )}
            </div>
            {/* Button action */}
            <div className="form-group">
                  <Button className="mr-2" type="button" variant="outline-danger" onClick={closeTab}>
                    {dataLabel.btnBackCreate?.name || 'Back'}
                  </Button>
                  <Button type="submit" variant="primary">
                    {loading && (
                      <Spinner
                        style={{
                          width: '1.5rem',
                          height: '1.5rem',
                        }}
                      />
                    )}
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
    </Fragment>
  );
};

export default withAuth(withLayout(CreateSysAttSubModal));
