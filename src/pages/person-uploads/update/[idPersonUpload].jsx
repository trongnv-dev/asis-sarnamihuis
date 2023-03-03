import React, { Fragment, useEffect, useState } from 'react';
import { Container, Button, Spinner } from '@blueupcode/components';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import Head from 'next/head';
import styles from 'styles/pages/person-upload-list.module.scss';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import { useForm } from 'react-hook-form';
import { personUploadApi, personApi } from 'services';
import { useRouter } from 'next/dist/client/router';
import * as yup from 'yup';
import { getPersonUploadList } from 'utils/label/';
import { CircularProgress, Typography } from '@mui/material';
import SelectInput from '../../../components/UI/features/SelectInput';

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
    uploadFile: yup.mixed()
      .test("required", "File is required", (value) => {
        console.log(value.length)
        return value.length != 0;
      })
      .test("fileSize", "The file is too large", (value) => {
        console.log(value)
        if (!value.length) return true // attachment is optional
        return value[0].size < 5120000
      })
      .test("fileSize", "Please provide a supported file type", (value) => {
        console.log(value)
        if (!value.length) return true // attachment is optional
        return ['png', 'jpg', 'jpeg', 'pdf', 'docx', 'dot', 'dotx', 'txt', 'xlsl', 'csv'].includes(value[0].type.split('/')[1])
      }),

    file_name: yup.array().of(
      yup.object().shape({
        name: yup.string().required(`name name can't empty`),
      })
    ),
  });

  const formOptions = {
    mode: 'all',
    resolver: yupResolver(schema),
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

  // Get selected default
  const getSelectDefault = (options, valueOption) => {
    const defaultOption = options.find((item) => item.value == valueOption);
    return defaultOption ?? null;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  const updatePersonUpload = async (formData) => {
    setLoading(true);
    try {
      var formDataBody = new FormData();
      formDataBody.append('id', parseInt(formData.id));
      formDataBody.append('idRelPerson', parseInt(formData.idRelPerson));
      formDataBody.append('uploadFile', formData.uploadFile[0]);

      formData.file_name.map((item, index) => {
        formDataBody.append(`translate[${index}][name]`, item.name);
        formDataBody.append(`translate[${index}][idLanguage]`, parseInt(item.idLanguage));
      })
      const res = await personUploadApi.editItemPersonUpload(formDataBody);

      if (res.status == 200) {
        await swal.fire({ text: res.data.update, icon: 'success' });
        closeTab();
      } else {
        swal.fire({ text: 'network error', icon: 'error' });
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
              <form onSubmit={handleSubmit(updatePersonUpload)}>
                {/* id */}
                <div className="form-group">
                  <input
                    id="idRelPerson"
                    name="idRelPerson"
                    {...register('idRelPerson')}
                    type="text"
                    className="form-control"
                    defaultValue={data.idRelPerson}
                    readOnly
                    hidden
                  />
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
                    <label className="form-label">{dataLabel.idUpdate.name ?? 'person upload id'}</label>
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
                </div>
                {<label for="uploadFile" className="form-label">
                  File
                </label>}
                {<input
                  id={`uploadFile`}
                  {...register(`uploadFile`)}
                  className="form-control"
                  type="file"
                />}
                {errors && errors[`uploadFile`] && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors[`uploadFile`]?.message}
                  </div>
                )}
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
                          {...register(`file_name.${index}.idLanguage`)}
                          type="text"
                          defaultValue={item.idLanguage}
                          hidden
                        />
                        <input
                          {...register(`file_name.${index}.idTranslate`)}
                          type="text"
                          defaultValue={item.idTranslate}
                          hidden
                        />
                        <span>
                          <img src={item.languageIcon} alt="icon" className="mr-2" />
                        </span>
                        <input
                          {...register(`file_name.${index}.name`)}
                          className="form-control"
                          type="text"
                          defaultValue={item.name}
                          required

                        />
                        {errors && errors[`file_name[${index}].name`] && (
                          <div style={{ display: 'block' }} className="invalid-feedback">
                            {errors[`file_name[${index}].name`]?.message}
                          </div>
                        )}
                      </li>
                    ))}
                  </div>
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

export default withAuth(withLayout(UpdatePersonUploadModal));
