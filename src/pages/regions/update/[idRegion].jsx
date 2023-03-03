import Head from 'next/head';
import { useForm } from 'react-hook-form';

import * as yup from 'yup';

import { yupResolver } from 'components/validation/yupResolver';
import { swal } from 'components/swal/instance';

import { regionApi, languageApi } from 'services';
import { getRegionList } from 'utils/label';
import styles from 'styles/pages/region-list.module.scss';

import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import { useEffect, useState } from 'react';
import { Button, Container, Spinner } from '@blueupcode/components';
import { CircularProgress, Typography } from '@mui/material';
import { Switch } from '@material-ui/core';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/dist/client/router';

// yup - schema
const schema = yup.object().shape({
  sort: yup.number().min(1).max(50).typeError('sort must be a number'),
  region: yup.array().of(
    yup.object().shape({
      region: yup.string().required('region name can not empty'),
    })
  ),
});

function UpdateRegionListModal() {
  const [readOnly, setReadOnly] = useState(true);
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { idRegion } = router.query;

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

  // Update region
  const updateRegion = (formData) => {
    console.log(formData);
  };

  // Close tab
  const closeTab = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
  };

  // API - getRegionLabel
  useEffect(() => {
    const fecthRegionLabel = async () => {
      try {
        const res = await regionApi.getRegionLabel();
        if (res.data && res.data?.data) {
          const regionLabel = getRegionList(res.data?.data);
          setDataLabel(regionLabel);
        } else {
          swal.fire({
            text: res.statusText,
            icon: 'error',
          });
        }
      } catch (e) {
        console.log(e);
        swal.fire({
          text: e,
          icon: 'error',
        });
        setPageLoading(false);
      }
      setPageLoading(false);
    };

    fecthRegionLabel();
  }, []);

  // API - getItemRegion
  useEffect(() => {
    if (!idRegion) return;

    setLoading(true);
    const fecthData = async () => {
      try {
        const res = await regionApi.getItemRegion(idRegion);
        if (res.data && res.data?.data) {
          setData(res.data?.data);
        } else {
          swal.fire({
            text: res.statusText,
            icon: 'error',
          });
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
        swal.fire({
          text: e,
          icon: 'error',
        });
      }
      setLoading(false);
    };
    fecthData();
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
        ) : dataLabel.sortCreate != undefined ? (
          <>
            {data.id && (
              <form onSubmit={handleSubmit(updateRegion)}>
                {/* CountryID */}
                <div className="form-group">
                  <label htmlFor="country" className="form-label">
                    Country Id
                  </label>
                  <input id="country" className="form-control" readOnly={readOnly} defaultValue="" />
                </div>
                {/* Perant Id */}
                <div className="form-group">
                  <label htmlFor="parentId" className="form-label">
                    Parent Id
                  </label>
                  <input id="parentId" className="form-control" readOnly={readOnly} defaultValue="" />
                </div>
                {/* Id */}
                <div className="form-group">
                  <label htmlFor="id" className="form-label">
                    {dataLabel.idUpdate?.name}
                  </label>
                  <input
                    {...register('id')}
                    id="id"
                    className="form-control"
                    readOnly={readOnly}
                    defaultValue={data.id}
                  />
                </div>
                {/* Translate */}
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
                      <li key={item.idLanguage} className="list-group-item">
                        <input {...register(`region.${index}.idTranslate`)} defaultValue={item.idTranslate} hidden />
                        <input {...register(`region.${index}.idLanguage`)} defaultValue={item.idLanguage} hidden />
                        <input {...register(`region.${index}.languageCode`)} defaultValue={item.languageCode} hidden />
                        <span>
                          <img src={item.languageIcon} alt="icon" className="mr-2 mb-1" />
                          <label className="form-label">{item.nameLanguage}</label>
                        </span>
                        <input
                          {...register(`region.${index}.region`)}
                          className="form-control"
                          defaultValue={item.region}
                        />
                        {errors[`region[${index}].region`] && (
                          <div className="invalid-feedback" style={{ display: 'block' }}>
                            {errors[`region[${index}].region`]?.message}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* sort */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.sortUpdate?.name}</label>
                  <input
                    {...register('sort')}
                    type="number"
                    className="form-control"
                    min={1}
                    max={50}
                    step={1}
                    defaultValue={data.sort}
                  />
                  {errors.sort && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.sort?.message}
                    </div>
                  )}
                </div>
                {/* isActive */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.isActiveUpdate?.name}</label>
                  <Switch
                    {...register('isActive')}
                    size="medium"
                    color="primary"
                    defaultChecked={data.isActive ? true : false}
                  />
                </div>
                {/* action buttons */}
                <div className="from-group d-flex justify-content-between mb-3">
                  <Button type="button" variant="outline-danger" className="mr-2" onClick={closeTab}>
                    {dataLabel.btnCloseUpdate?.name}
                  </Button>
                  <Button type="submit" variant="primary" disabled={readOnly}>
                    {loading && <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2 " />}
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

export default withAuth(withLayout(UpdateRegionListModal));
