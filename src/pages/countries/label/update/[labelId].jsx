import { countryApi } from 'services';
import React, { Fragment } from 'react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { getCountryLabel } from 'utils/label';
import { swal } from 'components/swal/instance';
import URL from 'config/api-url';

import { Container, Button, Spinner } from '@blueupcode/components';
import styles from 'styles/pages/country-list.module.scss';
import { CircularProgress, Typography } from '@mui/material';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import { useRouter } from 'next/dist/client/router';
import * as yup from 'yup';
import { yupResolver } from 'components/validation/yupResolver';
import { useForm } from 'react-hook-form';

const schema = yup.object().shape({
  sort: yup.number().typeError('you must specify a number'),
  translate: yup.array().of(
    yup.object().shape({
      label: yup.string().required(`label can't empty`),
    })
  ),
});

function UpdateLabelModal() {
  const [readOnly, setReadOnly] = useState(true);
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { labelId } = router.query;
  const id = Number(labelId);
  const tableName = dataLabel.action?.table;

  // Close tab
  const closeTab = () => {
    router.back();
  };

  // Update label
  const updateLabel = async (formData) => {
    setLoading(true);
    try {
      const res = await countryApi.editCountryLabel({
        idLabel: formData.idLabel,
        sort: formData.sort,
        table: tableName,
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

  // Call API get data country label
  useEffect(() => {
    setPageLoading(true);
    const getDataCountryLabel = async () => {
      try {
        const res = await countryApi.getCountryLabel();
        if (res.status === 200) {
          const countryLabel = getCountryLabel(res.data?.data);
          setDataLabel(countryLabel);
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
        setPageLoading(false);
      }
      setPageLoading(false);
    };
    getDataCountryLabel();
  }, []);

  // Call api get data
  useEffect(() => {
    if (!tableName) return;
    setLoading(true);
    const loadData = async () => {
      try {
        const res = await countryApi.getItemCountryLabel({ id, tableName });
        if (res?.data) {
          const tmp = {
            idLabel: id,
            sort: 50,
            table: tableName,
            translate: res.data,
          };
          setData(tmp);
        }
      } catch (e) {
        console.log(e);
        swal.fire({
          text: e,
          icon: 'error',
        });
        setLoading(false);
      }
      setLoading(false);
    };

    loadData();
  }, [tableName]);

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
            {data.idLabel && (
              <form onSubmit={handleSubmit(updateLabel)}>
                {/* id */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.idUpdate?.name}</label>
                  <input
                    id="idLabel"
                    {...register('idLabel')}
                    type="text"
                    className="form-control"
                    defaultValue={data.idLabel}
                    readOnly={readOnly}
                  />
                </div>
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
                    {data.translate?.map((item, index) => (
                      <li className="list-group-item" key={item.idLanguage}>
                        <span>
                          <img src={URL.BASE_URL + item.icon} alt="icon" className="mr-2" />
                        </span>
                        <input
                          id={`trans_${item.idLanguage}`}
                          {...register(`translate.${index}.idLanguage`)}
                          className="form-control"
                          type="text"
                          defaultValue={item.idLanguage}
                          hidden
                        />
                        <input
                          id={`trans_${item.label}`}
                          {...register(`translate.${index}.label`)}
                          className="form-control"
                          type="text"
                          defaultValue={item.label == null ? '' : item.label}
                          required
                        />
                        {errors && errors[`translate[${index}].label`] && (
                          <div style={{ display: 'block' }} className="invalid-feedback">
                            {errors[`translate[${index}].label`]?.message}
                          </div>
                        )}
                      </li>
                    ))}
                  </div>
                </div>
                {/* Sort */}
                <div className="form-group">
                  <label className="form-label" htmlFor="sort">
                    {dataLabel.sortUpdate?.name}
                  </label>
                  <input
                    id="sort"
                    type="number"
                    {...register('sort')}
                    className="form-control"
                    min={1}
                    max={50}
                    step={1}
                    defaultValue={data.sort}
                  />
                  {errors.sort && (
                    <div style={{ display: 'block' }} className="invalid-feedback">
                      {errors.sort?.message}
                    </div>
                  )}
                </div>
                {/* actions */}
                <div className="form-group">
                  <Button className="mr-2" type="button" variant="outline-danger" onClick={closeTab}>
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
}

export default withAuth(withLayout(UpdateLabelModal));
