import React, { Fragment, useEffect, useState } from 'react';
import { Container, Button, Spinner } from '@blueupcode/components';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import Head from 'next/head';
import styles from 'styles/pages/person-upload-list.module.scss';
import { Switch } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import { useForm } from 'react-hook-form';
import { personUploadApi, personApi } from 'services';
import { useRouter } from 'next/dist/client/router';
import * as yup from 'yup';
import { getPersonUploadList } from 'utils/label/';
import { CircularProgress, Typography } from '@mui/material';
import SelectInput from '../../components/UI/features/SelectInput';

const UpdatePersonUploadModal = () => {
  const [dataLabel, setDataLabel] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const router = useRouter();
  const { idPersonUpload } = router.query;
  // RelPerson
  const [personSelected, setPersonSelected] = useState(null);
  const [personOptions, setPersonOptions] = useState([]);

  const schema = yup.object().shape({
    sort: yup.number().min(1).max(50).typeError('you must specify a number'),
    personUpload: yup.array().of(
      yup.object().shape({
        name: yup.string().required(`personUpload name can't empty`),
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


  const closeTab = () => {
    router.back();
  };

  // Get selected default
  const getSelectDefault = (options, valueOption) => {
    const defaultOption = options.find((item) => item.value == valueOption);
    return defaultOption ?? null;
  };
  // RelPerson - Load RelPerson options
  useEffect(() => {
    async function loadPersonData() {
      try {
        const res = await personApi.getPersonList({
          orderBy: 'id',
          direction: 'asc',
          parPage: '',
          page: 1,
          searchAll: '',
        });
        if (res.data && res.data?.data) {
          const personData = res.data.data.map((item) => ({ label: `${item.firstName} ${item.middleName} ${item.lastName}`, value: item.id }));
          setPersonOptions(personData);
        }
      } catch (e) {
        console.log(e);
      }
    }
    loadPersonData();
  }, []);

  // API - getPersonUploadLabel
  useEffect(() => {
    setPageLoading(true);
    async function getPersonUploadLabel() {
      try {
        const res = await personUploadApi.getPersonUploadLabel();
        if (res.data && res.data.data) {
          const personUploadLabel = getPersonUploadList(res.data.data);
          setDataLabel(personUploadLabel);
        } else {
          swal.fire({ text: res.statusText, icon: 'error' });
        }
      } catch (e) {
        swal.fire({ text: e, icon: 'error' });
        setPageLoading(false);
      }
      setPageLoading(false);
    }
    getPersonUploadLabel();
  }, []);

  // API  - getItemPersonUpload
  useEffect(() => {
    if (!idPersonUpload) return;
    setLoading(true);
    const loadData = async () => {
      try {
        const res = await personUploadApi.getItemPersonUpload(idPersonUpload);
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
        <title>{dataLabel.textTitleDetail?.name}</title>
      </Head>
      <Container fluid>
        {pageLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : dataLabel.sortUpdate != undefined ? (
          <>
            {data.id && (
              <form>
                <div className="form-group">
                  <label htmlFor="person" className="form-label">
                    {dataLabel.personNameUpdate?.name ?? 'rel person'}
                  </label>
                  <SelectInput
                    options={personOptions}
                    onChange={(e) => setPersonSelected(e)}
                    defaultValue={getSelectDefault(personOptions, data.idRelPerson)}
                    menuPlacement="bottom"
                    isDisabled={true}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{dataLabel.idDetail.name ?? 'person upload id'}</label>
                  <input
                    id="id"
                    name="id"
                    {...register('id')}
                    type="text"
                    className="form-control"
                    defaultValue={data.id}
                    readOnly

                  // hidden
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
                          {...register(`personUpload.${index}.idLanguage`)}
                          type="text"
                          defaultValue={item.idLanguage}
                          hidden
                        />
                        <input
                          {...register(`personUpload.${index}.idTranslate`)}
                          type="text"
                          defaultValue={item.idTranslate}
                          hidden
                        />
                        <span>
                          <img src={item.languageIcon} alt="icon" className="mr-2" />
                        </span>
                        <input
                          {...register(`personUpload.${index}.name`)}
                          className="form-control"
                          type="text"
                          defaultValue={item.name}
                          required
                          readOnly
                        />
                        {errors && errors[`personUpload[${index}].name`] && (
                          <div style={{ display: 'block' }} className="invalid-feedback">
                            {errors[`personUpload[${index}].name`]?.message}
                          </div>
                        )}
                      </li>
                    ))}
                  </div>
                </div>
                <div className="from-group">
                  <Button type="button" className="mr-2" variant="outline-danger" onClick={closeTab}>
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
    </Fragment>
  );
};

export default withAuth(withLayout(UpdatePersonUploadModal));
