import { Container, Button, Spinner } from '@blueupcode/components';
import { CircularProgress, Typography } from '@mui/material';
import Head from 'next/head';

import { useRouter } from 'next/dist/client/router';

import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import { swal } from 'components/swal/instance';
import { useEffect, useState } from 'react';

import { personApi } from 'services';
import { getPersonLabel } from 'utils/label';

import styles from 'styles/pages/person-list.module.scss';
import URL from 'config/api-url';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from 'components/validation/yupResolver';

// yup -schema
const schema = yup.object().shape({
  sort: yup.number().min(1).max(50).required().typeError('sort must be a number'),
  translate: yup.array().of(
    yup.object().shape({
      label: yup.string().required('label can not empty'),
    })
  ),
});

function UpdateLabelPersonModal() {
  const [pageLoading, setPageLoading] = useState(true); // true
  const [loading, setLoading] = useState(false);
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});

  const router = useRouter();
  const { idLabel } = router.query;

  const tableName = dataLabel.action?.table;

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

  // Close tab
  const closeTab = () => {
    router.back();
  };

  // Update label Person
  const updateLabel = async (formData) => {
    setLoading(true);
    try {
      const res = await personApi.editPersonLabel({
        idLabel: formData.id,
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
      console.log(e);
      setLoading(false);
      swal.fire({
        text: e,
        icon: 'error',
      });
    }
    setLoading(false);
  };

  // API - getPersonLabel
  useEffect(() => {
    const fecthPersonLabel = async () => {
      try {
        const res = await personApi.getPersonLabel();
        if (res.data && res.data?.data) {
          const personLabel = getPersonLabel(res.data?.data);
          setDataLabel(personLabel);
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
    fecthPersonLabel();
  }, []);

  // API - getItemPersonLabel;
  useEffect(() => {
    if (!idLabel) return;
    if (!tableName) return;

    const fecthData = async () => {
      setLoading(true);
      try {
        const res = await personApi.getItemPersonLabel({
          id: idLabel,
          tableName: tableName,
        });
        if (res.data) {
          const tmp = {
            idLabel: idLabel,
            sort: 50,
            translate: res.data,
          };

          setData(tmp);
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
        setLoading(false);
      }
      setLoading(false);
    };
    fecthData();
  }, [tableName, idLabel]);

  return (
    <>
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
                  <input {...register('id')} defaultValue={data.idLabel} className="form-control" readOnly />
                </div>
                {/* Translate */}
                <div className="form-group">
                  <label className="form-label">Traslate</label>
                  <ul
                    className="list-group"
                    style={{
                      maxHeight: 240,
                      overflowY: 'scroll',
                    }}
                  >
                    {data.translate?.map((item, index) => (
                      <li key={item.idLanguage} className="list-group-item">
                        <span>
                          <img src={URL.BASE_URL + item.icon} />
                        </span>
                        <input
                          {...register(`translate.${index}.idLanguage`)}
                          className="form-control"
                          defaultValue={item.idLanguage}
                          hidden
                        />
                        <input
                          {...register(`translate.${index}.label`)}
                          className="form-control"
                          defaultValue={item.label}
                        />
                        {errors[`translate[${index}].label`] && (
                          <div style={{ display: 'block' }} className="invalid-feedback">
                            {errors[`translate[${index}].label`]?.message}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* sort */}
                <div className="form-group">
                  <label htmlFor="sort" className="form-label">
                    {dataLabel.sortUpdate?.name}
                  </label>
                  <input
                    {...register('sort')}
                    id="sort"
                    className="form-control"
                    type="number"
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
                {/* Action buttons */}
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
    </>
  );
}

export default withAuth(withLayout(UpdateLabelPersonModal));
