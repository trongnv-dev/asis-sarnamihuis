import { countryApi } from 'services';
import { getCountryList } from 'utils/label';
import { Container, Button, Spinner } from '@blueupcode/components';
import { swal } from 'components/swal/instance';
import { Typography, CircularProgress } from '@mui/material';
import styles from 'styles/pages/country-list.module.scss';
import { Switch } from '@material-ui/core';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import { yupResolver } from 'components/validation/yupResolver';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

const schema = yup.object().shape({
  sort: yup.number().typeError('You must specify a number'),
  country: yup.array().of(
    yup.object().shape({
      country: yup.string().required(`Translate country name can't empty`),
      idLanguage: yup.number().required(),
    })
  ),
});

function UpdateCountryModal() {
  const router = useRouter();
  const countryId = router.query.countryId;

  const [dataLabel, setDataLabel] = useState({});
  const [readOnly, setReadOnly] = useState(false);
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
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

  // Update country
  const updateCountry = async (formData) => {
    setLoading(true);
    try {
      const res = await countryApi.editItemCountry({
        id: formData.id,
        sort: formData.sort,
        translate: formData.country,
        isActive: formData.isActive,
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

  // get data label
  useEffect(() => {
    setPageLoading(true);
    const getCountryLabel = async () => {
      try {
        const res = await countryApi.getCountryLabel();
        if (res.status === 200) {
          const countryLabel = getCountryList(res.data.data);
          setDataLabel(countryLabel);
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
    getCountryLabel();
  }, []);

  // get data item country
  useEffect(() => {
    const getCountry = async () => {
      try {
        const res = await countryApi.getItemCountry(countryId);
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getCountry();
  }, []);

  return (
    <>
      <Head>
        <title>{dataLabel && dataLabel.titlePageUpdate?.name}</title>
      </Head>
      <Container fluid>
        {pageLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : dataLabel.sortUpdate != undefined ? (
          <>
            {data.id && (
              <form onSubmit={handleSubmit(updateCountry)}>
                {/* id */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.idUpdate?.name}</label>
                  <input className="form-control" defaultValue={data.id} readOnly {...register('id')} />
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
                      <li className="list-group-item">
                        <input
                          type="text"
                          defaultValue={item.idLanguage}
                          {...register(`country.${index}.idLanguage`)}
                          hidden
                        />
                        <span>
                          <img src={item.languageIcon} alt={item.languageCode} />
                        </span>
                        <input
                          className="form-control"
                          type="text"
                          defaultValue={item.country}
                          // required
                          readOnly={readOnly}
                          {...register(`country.${index}.country`)}
                        />
                        {errors[`country[${index}].country`] && (
                          <div className="invalid-feedback" style={{ display: 'block' }}>
                            {errors[`country[${index}].country`]?.message}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Sort */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.sortUpdate?.name}</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    step={1}
                    className="form-control"
                    defaultValue={data.sort}
                    readOnly={readOnly}
                    {...register('sort')}
                  />
                  {errors.sort && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.sort?.message}
                    </div>
                  )}
                </div>
                {/* IsActive */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.isActiveUpdate?.name}</label>
                  <Switch
                    color="primary"
                    defaultChecked={data.isActive}
                    disabled={readOnly}
                    {...register('isActive')}
                  />
                </div>
                {/* Actions */}
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

export default withAuth(withLayout(UpdateCountryModal));
