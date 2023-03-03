import { Container } from '@blueupcode/components';
import {
  CircularProgress,
  Typography,
} from '@mui/material';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import Head from 'next/head';
import styles from 'styles/pages/person-upload-list.module.scss';

import { Button, Modal, Spinner } from '@blueupcode/components';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { personUploadApi, languageApi, personApi } from 'services';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { getPersonUploadList } from 'utils/label/';
import SelectInput from '../../components/UI/features/SelectInput';
import { useRouter } from 'next/dist/client/router';

const CreatePersonUploadModal = (props) => {
  const [dataLabel, setDataLabel] = useState([]);
  const isSwitch = useSelector((state) => state.page.isQuickEdit);
  const [pageLoading, setPageLoading] = useState(false);
  // RelPerson
  const [personSelected, setPersonSelected] = useState(null);
  const [personOptions, setPersonOptions] = useState([]);
  const router = useRouter();

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

  const closeTab = () => {
    router.back();
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


  useEffect(() => {
    setPageLoading(true);
    async function getPersonUploadLabel() {
      try {
        let response = await personUploadApi.getPersonUploadLabel();
        if (response.status === 200) {
          const label = getPersonUploadList(response.data.data);
          setDataLabel(label);
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (error) {
        swal.fire({ text: error.message, icon: 'error' });
      }
      setPageLoading(false);
    }
    getPersonUploadLabel();
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

  const createPersonUpload = async (formData) => {
    if (personSelected == null)
      return;
    setLoading(true);
    try {
      var formDataBody = new FormData();
      formDataBody.append('idRelPerson', parseInt(personSelected.value));
      formDataBody.append('uploadFile', formData.uploadFile[0]);

      var data = {};
      formData.file_name.map((item, index) => {
        formDataBody.append(`translate[${index}][name]`, item.name);
        formDataBody.append(`translate[${index}][idLanguage]`, parseInt(item.idLanguage));
      })

      const res = await personUploadApi.createItemPersonUpload(formDataBody);

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
          let personata = array.map((item) => {
            return {
              idLanguage: item.idLanguage,
              nameLanguage: item.name,
              iconLanguage: item.icon,
            };
          });

          let dataValue = {
            person: personata,
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
        ) : dataLabel.sortCreate != undefined ? (
          <form onSubmit={handleSubmit(createPersonUpload.id)}>

            {/* person */}
            <div className="form-group">
              <label htmlFor="person" className="form-label">
                {dataLabel.personNameCreate?.name ?? 'Person'}
              </label>
              <SelectInput options={personOptions} onChange={(e) => setPersonSelected(e)} menuPlacement="bottom" />
            </div>
            <div className="form-group">
              <label for="uploadFile" className="form-label">
                File
              </label>
              <input
                id={`uploadFile`}
                {...register(`uploadFile`)}
                className="form-control"
                type="file"
              />{errors && errors[`uploadFile`] && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors[`uploadFile`]?.message}
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
                {data.person &&
                  data.person.map((item, index) => (
                    <li className="list-group-item">
                      <span>
                        <img src={item.iconLanguage} alt="icon" />
                        {'	'}
                        <label for={`file_name_${item.idLanguage}`} className="form-label">
                          {item.nameLanguage}
                        </label>
                      </span>
                      <input
                        id={`file_name_${item.idLanguage}`}
                        {...register(`file_name.${index}.idLanguage`)}
                        className="form-control"
                        type="text"
                        defaultValue={item.idLanguage}
                        hidden
                      />
                      <input
                        id={`file_name_${item.name}`}
                        {...register(`file_name.${index}.name`)}
                        className="form-control"
                        type="text"
                        defaultValue={item.name == null ? '' : item.name}
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
              <Button type="submit" onClick={handleSubmit(createPersonUpload)} variant="primary">
                {loading && <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />}
                {dataLabel.btnSaveUpdate?.name}
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

export default withAuth(withLayout(CreatePersonUploadModal));
