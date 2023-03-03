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

// yup - schema
const schema = yup.object().shape({
  sort: yup.number().min(1).max(50).typeError('sort must be a number'),
  region: yup.array().of(
    yup.object().shape({
      region: yup.string().required('region name can not empty'),
    })
  ),
});

function CreateRegionModal() {
  const [readOnly, setReadOnly] = useState(true);
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

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

  // Create region
  const createRegion = (formData) => {};

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

  // API - getCurrentLanguageList
  useEffect(() => {
    setLoading(true);
    const fecthData = async () => {
      try {
        const res = await languageApi.getCurrentLanguageList();
        if (res.data?.listLanguageActive) {
          const array = Object.entries(res.data?.listLanguageActive).map(([key, value]) => value);

          const regionData = array.map((item) => ({
            idLanguage: item.idLanguage,
            nameLanguage: item.name,
            iconLanguage: item.icon,
          }));

          setData({
            sort: 50, // defalut
            region: regionData,
          });
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
      setLoading(false);
    };
    fecthData();
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
          <>
            {!isEmpty(data.region) && (
              <form onSubmit={handleSubmit(createRegion)}>
                {/* CountryID */}
                <div className="form-group">
                  <label className="form-label">Country Id</label>
                  <input className="form-control" readOnly={readOnly} defaultValue="" />
                </div>
                {/* Perant Id */}
                <div className="form-group">
                  <label className="form-label">Parent Id</label>
                  <input className="form-control" readOnly={readOnly} defaultValue="" />
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
                    {data.region?.map((item, index) => (
                      <li key={item.idLanguage} className="list-group-item">
                        <span>
                          <img src={item.iconLanguage} alt="icon" className="mr-2 mb-1" />
                          <label className="form-label">{item.nameLanguage}</label>
                        </span>
                        <input className="form-control" defaultValue={item.idLanguage} hidden />
                        <input className="form-control" />
                      </li>
                    ))}
                  </ul>
                </div>
                {/* sort */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.sortCreate?.name}</label>
                  <input
                    {...register('sort')}
                    type="number"
                    className="form-control"
                    min={1}
                    max={50}
                    step={1}
                    defaultValue={50}
                  />
                  {errors.sort && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.sort?.message}
                    </div>
                  )}
                </div>
                {/* isActive */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.isActiveCreate?.name}</label>
                  <Switch size="medium" color="primary" />
                </div>
                {/* action buttons */}
                <div className="from-group">
                  <Button type="button" variant="outline-danger" className="mr-2" onClick={closeTab}>
                    {dataLabel.btnCloseCreate?.name}
                  </Button>
                  <Button type="submit" variant="primary" className="float-right" disabled={readOnly}>
                    {loading && <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2 " />}
                    {dataLabel.btnCreate?.name}
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

export default withAuth(withLayout(CreateRegionModal));
