import { useRouter } from 'next/dist/client/router';
import { languageApi } from 'services';
import { getLanguageList } from 'utils/label';
import styles from 'styles/pages/language-list.module.scss';
import { CircularProgress, Typography } from '@mui/material';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Container, Button, Spinner } from '@blueupcode/components';
import { Switch } from '@material-ui/core';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { yupResolver } from 'components/validation/yupResolver';
import { swal } from 'components/swal/instance';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';

// Yup - schema
const schema = yup.object().shape({
  translate: yup.array().of(
    yup.object().shape({
      id: yup.number().required(),
      name: yup.string().required(`Translate name can't empty`),
      idLanguage: yup.number().required(),
    })
  ),
  code: yup.string().required('Code can not empty'),
  culture: yup.string().required('Culture can not empty'),
  dateFormat: yup.string().required('Date format can not empty'),
  sort: yup.number().min(1).max(50).typeError('You must specify a number'),
});

function UpdateLanguageModal() {
  const router = useRouter();
  const { idLanguage } = router.query;

  const [readOnly, setReadOnly] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});

  const updateLanguage = async (formData) => {
    setLoading(true);
    try {
      const res = await languageApi.editItemLanguage({
        id: formData.id,
        code: formData.code,
        culture: formData.culture,
        icon: formData.icon,
        sort: formData.sort,
        dateFormat: formData.dateFormat,
        isActive: formData.isActive,
        translate: formData.translate,
      });
      if (res.status === 200) {
        swal.fire({
          text: res.statusText,
          icon: 'success',
        });
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
      setLoading(false);
    }
    setLoading(false);
  };

  // Close tab
  const closeTab = () => {
    router.back();
  };

  // Working with form
  const formOptions = {
    mode: 'all',
    resolver: yupResolver(schema),
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  // API - getLanguageLabel
  useEffect(() => {
    setPageLoading(true);
    const loadDataLabel = async () => {
      try {
        const res = await languageApi.getLanguageLabel();

        if (res.status === 200) {
          const languageLabel = getLanguageList(res.data.data);
          setDataLabel(languageLabel);
        } else {
          swal.fire({
            text: res.statusText,
            icon: 'error',
          });
        }
      } catch (e) {
        setPageLoading(false);
        swal.fire({
          text: e,
          icon: 'error',
        });
      }
      setPageLoading(false);
    };
    loadDataLabel();
  }, []);

  // API - getItemLanguage
  useEffect(() => {
    if (!idLanguage) return;
    setLoading(true);
    const loadItemLanguage = async () => {
      try {
        const res = await languageApi.getItemLanguage(idLanguage);
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
      } catch (e) {
        setLoading(false);
        swal.fire({ text: e, icon: 'error' });
      }
      setLoading(false);
    };
    loadItemLanguage();
  }, []);

  return (
    <>
      <Head>
        <title>{dataLabel && dataLabel.textTitleUpdate?.name}</title>
      </Head>
      <Container fluid>
        {pageLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : dataLabel.sortUpdate != undefined ? (
          <>
            {data.id && (
              <form onSubmit={handleSubmit(updateLanguage)}>
                {/* id */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.idUpdate?.name}</label>
                  <input {...register('id')} className="form-control" defaultValue={data.id} readOnly={readOnly} />
                </div>
                {/* translate */}
                <div className="form-group">
                  <label className="form-label">Translate</label>
                  <ul
                    className="list-group"
                    style={{
                      maxHeight: 240,
                      overflowY: 'scroll',
                    }}
                  >
                    {data.translate?.map((item, index) => (
                      <li className="list-group-item" key={item.id}>
                        <input {...register(`translate.${index}.id`)} defaultValue={item.id} hidden />
                        <input
                          type="text"
                          {...register(`translate.${index}.idLanguage`)}
                          defaultValue={item.idLanguage}
                          hidden
                        />
                        <span>
                          <img src={item.icon} alt={item.nameLanguage} className="mr-2" />
                          <label className="form-label">{item.nameLanguage}</label>
                        </span>
                        <input
                          {...register(`translate.${index}.name`)}
                          className="form-control"
                          type="text"
                          defaultValue={item.name}
                        />
                        {errors[`translate[${index}].name`] && (
                          <div className="invalid-feedback" style={{ display: 'block' }}>
                            {errors[`translate[${index}].name`]?.message}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* code */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.codeUpdate?.name}</label>
                  <input {...register('code')} className="form-control" defaultValue={data.code} readOnly={readOnly} />
                  {errors.code && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.code?.message}
                    </div>
                  )}
                </div>

                {/* culture */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.cultureUpdate?.name}</label>
                  <input
                    {...register('culture')}
                    className="form-control"
                    defaultValue={data.culture}
                    readOnly={readOnly}
                  />
                  {errors.culture && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.culture?.message}
                    </div>
                  )}
                </div>

                {/* Date format  */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.dateFormatUpdate?.name}</label>
                  <input
                    {...register('dateFormat')}
                    defaultValue={moment(data.dateFormat, 'DD/MM/YYYY').format('DD/MM/YYYY')}
                    className="form-control"
                  />
                  {errors.dateFormat && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.dateFormat?.message}
                    </div>
                  )}
                </div>

                {/* sort */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.sortUpdate?.name}</label>
                  <input
                    {...register('sort')}
                    type="number"
                    min={1}
                    max={50}
                    step={1}
                    className="form-control"
                    defaultValue={data.sort}
                  />
                  {errors.sort && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.sort?.message}
                    </div>
                  )}
                </div>
                {/* icon */}
                <div className="form-group" hidden>
                  <label className="form-label">{dataLabel.iconUpdate?.name}</label>
                  <input {...register('icon')} className="form-control" defaultValue={data.icon} />
                  <img src={data.icon} alt="icon" />
                </div>

                {/* active */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.isActiveUpdate?.name}</label>
                  <Switch
                    size="medium"
                    {...register('isActive')}
                    color="primary"
                    defaultChecked={data.isActive ? true : false}
                  />
                </div>
                {/* actions button */}
                <div className="form-group">
                  <Button variant="outline-danger" type="button" className="mr-2" onClick={closeTab}>
                    {dataLabel.btnBackUpdate?.name || 'Back'}
                  </Button>
                  <Button type="submit" variant="primary">
                    {loading && (
                      <Spinner
                        style={{
                          width: '1.5rem',
                          height: '1.5rem',
                        }}
                        className="mr-2"
                      />
                    )}
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

export default withAuth(withLayout(UpdateLanguageModal));
