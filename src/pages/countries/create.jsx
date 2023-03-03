import { Fragment } from 'react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { Container, Button, Spinner } from '@blueupcode/components';
import styles from 'styles/pages/country-list.module.scss';
import { CircularProgress, Typography } from '@mui/material';
import { Switch } from '@material-ui/core';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import { countryApi, languageApi } from 'services';
import { getCountryList } from 'utils/label';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';

function CreateCountryModal() {
  const router = useRouter();

  const [dataLabel, setDataLabel] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // YUP
  const schema = yup.object().shape({
    sort: yup.number().typeError('You must specify a number'),

    country: yup.array().of(
      yup.object().shape({
        country: yup.string().required(`Country name can't empty`),
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
    reset,
    formState: { errors },
  } = useForm(formOptions);

  // Create Country
  const createCountry = async (formData) => {
    setLoading(true);
    try {
      const response = await countryApi.createItemCountry({
        country: formData.country,
        sort: formData.sort,
        isActive: formData.isActive,
      });

      if (response.status === 200) {
        await swal.fire({ text: response.statusText, icon: 'success' });
        resetForm();
      } else {
        swal.fire({ text: response.statusText, icon: 'error' });
      }
    } catch (e) {
      swal.fire({ text: e, icon: 'error' });
    }
    setLoading(false);
  };

  // Close tab
  const closeTab = () => {
    router.back();
  };

  const resetForm = () => {
    reset();
  };

  // Call API get title country
  useEffect(() => {
    setPageLoading(true);
    async function getCountryLabel() {
      try {
        const response = await countryApi.getCountryLabel();
        if (response.status === 200) {
          const countryLabel = getCountryList(response.data.data);
          setDataLabel(countryLabel);
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (error) {
        swal.fire({ text: error.message, icon: 'error' });
      }
      setPageLoading(false);
    }

    getCountryLabel();
  }, []);

  // call API get data
  useEffect(() => {
    setLoading(true);
    async function loadData() {
      try {
        const response = await languageApi.getCurrentLanguageList();
        if (response.status === 200) {
          const array = Object.values(response.data.listLanguageActive).map((key) => key);
          const countryData = array.map((item) => ({
            idLanguage: item.idLanguage,
            nameLanguage: item.name,
            iconLanguage: item.icon,
          }));

          setData({
            sort: 50,
            country: countryData,
          });
        }
      } catch (e) {
        console.log('error loadData: ', e);
        setLoading(false);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <Fragment>
      <Head>
        <title>{dataLabel.titlePageCreate != undefined ? dataLabel.titlePageCreate.name : ''}</title>
      </Head>
      <Container fluid>
        {pageLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : dataLabel.sortCreate != undefined ? (
          <form onSubmit={handleSubmit(createCountry)}>
            {/* Translate */}
            <div className="form-group">
              <label className="form-label">Translate</label>
              <div
                className="list-group"
                style={{
                  maxHeight: 240,
                  overflowY: 'scroll',
                }}
              >
                {data.country?.map((item, index) => (
                  <li className="list-group-item" key={item.idLanguage}>
                    <span>
                      <img src={item.iconLanguage} alt="icon" className="mr-2" />
                      <label htmlFor={`country_${item.idLanguage}`} className="form-label">
                        {item.nameLanguage}
                      </label>
                    </span>
                    <input
                      id={`country_${item.idLanguage}`}
                      {...register(`country.${index}.idLanguage`)}
                      className="form-control"
                      type="text"
                      defaultValue={item.idLanguage}
                      hidden
                    />
                    <input
                      id={`country_${item.country}`}
                      {...register(`country.${index}.country`)}
                      className="form-control"
                      type="text"
                      // required
                    />
                    {errors && errors[`country[${index}].country`] && (
                      <div style={{ display: 'block' }} className="invalid-feedback">
                        {errors[`country[${index}].country`]?.message}
                      </div>
                    )}
                  </li>
                ))}
              </div>
            </div>
            {/* Sort */}
            <div className="form-group">
              <label className="form-label" htmlFor="sort">
                {dataLabel.sortCreate?.name}
              </label>
              <input
                id="sort"
                {...register('sort')}
                type="number"
                className="form-control"
                min={1}
                max={50}
                step={1}
                defaultValue={50}
              />
              {errors.sort && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.sort?.message}
                </div>
              )}
            </div>
            {/* Active */}
            <div className="form-group">
              <label htmlFor="isActive" className="form-label">
                {dataLabel.isActiveCreate.name}
              </label>
              <Switch id="isActive" color="primary" {...register('isActive')} />
            </div>

            {/* Actions */}
            <div className="form-group">
              <Button className="mr-2" type="button" variant="outline-danger" onClick={closeTab}>
                {dataLabel.btnBackCreate?.name || 'Back'}
              </Button>
              <Button type="submit" variant="primary">
                {loading && <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />}
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
}

export default withAuth(withLayout(CreateCountryModal));
