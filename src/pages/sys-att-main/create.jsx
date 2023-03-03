import { Container} from '@blueupcode/components';
import {
  CircularProgress,
  Typography,
} from '@mui/material';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import Head from 'next/head';
import styles from 'styles/pages/sys-att-main-list.module.scss';

import { Button, Spinner } from '@blueupcode/components';
import { Switch } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { sysAttMainApi, languageApi } from 'services';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { getSysAttMainList } from 'utils/label/';
import { useRouter } from 'next/dist/client/router';

const CreateSysAttMainModal = (props) => {
  const router = useRouter();
  const [dataLabel, setDataLabel] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);

  const schema = yup.object().shape({
    code: yup.string().required(`Code can't empty`),
    sysAttMain: yup.array().of(
      yup.object().shape({
        name: yup.string().required(`Name can't empty`),
      })
    ),
  });

  const closeTab = () => {
    router.back();
  };

  useEffect(() => {
    setPageLoading(true);
    async function getSysAttMainLabel() {
      try {
        let response = await sysAttMainApi.getSysAttMainLabel();
        if (response.status === 200) {
          const sysAttMainLabel = getSysAttMainList(response.data.data);
          setDataLabel(sysAttMainLabel);
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (error) {
        swal.fire({ text: error.message, icon: 'error' });
      }
      setPageLoading(false);
    }
    getSysAttMainLabel();
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

  const createSysAttMain = async (formData) => {
    setLoading(true);
    try {
      const res = await sysAttMainApi.createItemSysAttMain({
        attMain: formData.sysAttMain,
        is_edit: formData.isActive===true?1:0,
        name: "1",
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
          let sysAttMainData = array.map((item) => {
            return {
              idLanguage: item.idLanguage,
              nameLanguage: item.name,
              iconLanguage: item.icon,
            };
          });

          let dataValue = {
            sysAttMain: sysAttMainData,
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
            <form onSubmit={handleSubmit(createSysAttMain)}>
              <div className="form-group">
                <label className="form-label">{dataLabel.codeCreate.name}</label>
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
                  {data.sysAttMain &&
                    data.sysAttMain.map((item, index) => (
                      <li className="list-group-item">
                        <span>
                          <img src={item.iconLanguage} alt="icon" />
                          {'	'}
                          <label for={`sysAttMain_${item.idLanguage}`} className="form-label">
                            {item.nameLanguage}
                          </label>
                        </span>
                        <input
                          id={`sysAttMain_${item.idLanguage}`}
                          {...register(`sysAttMain.${index}.idLanguage`)}
                          className="form-control"
                          type="text"
                          defaultValue={item.idLanguage}
                          hidden
                        />
                        <input
                          id={`sysAttMain_${item.name}`}
                          {...register(`sysAttMain.${index}.name`)}
                          className="form-control"
                          type="text"
                          defaultValue={item.name == null ? '' : item.name}
                          required
                        />
                        {errors && errors[`sysAttMain[${index}].name`] && (
                          <div style={{ display: 'block' }} className="invalid-feedback">
                            {errors[`sysAttMain[${index}].name`]?.message}
                          </div>
                        )}
                      </li>
                    ))}
                </div>
              </div>
              <div className="form-group">
                <label for="isActive" className="form-label">
                  {dataLabel.isEditCreate.name}
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

export default withAuth(withLayout(CreateSysAttMainModal));
