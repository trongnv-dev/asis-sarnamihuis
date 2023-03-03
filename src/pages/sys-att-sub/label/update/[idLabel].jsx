import { useRouter } from 'next/dist/client/router';
import { getSysAttSubLabel } from 'utils/label/';
import { sysAttSubApi } from 'services';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from 'styles/pages/sys-att-sub-list.module.scss';
import { swal } from 'components/swal/instance';
import { Container, Button, Spinner } from '@blueupcode/components';
import { CircularProgress, Typography } from '@mui/material';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import * as yup from 'yup';
import { yupResolver } from 'components/validation/yupResolver';
import { useForm } from 'react-hook-form';
import URL from 'config/api-url';

const schema = yup.object().shape({
  sort: yup.number().min(1).max(50).typeError('you must specify a number'),
  translate: yup.array().of(
    yup.object().shape({
      label: yup.string().required(`label can't empty`),
    })
  ),
});

function UpdateLabelSysAttSubModal() {
  const [readOnly, setReadOnly] = useState(true);
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { idLabel } = router.query;
  const tableName = dataLabel.action?.table;

  // Close tab
  const closeTab = () => {
    router.back();
  };

  // Update label
  const updateLabel = async (formData) => {
    setLoading(true);
    try {
      const res = await sysAttSubApi.editSysAttSubLabel({
        idLabel: formData.idLabel,
        sort: formData.sort,
        table: tableName,
        translate: formData.translate,
      });
      if (res.status === 200) {
        window.opener.location.reload();
        await swal.fire({
          text: res.statusText,
          icon: 'success',
        });
        closeTab();
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

  // API - getSysAttSubLabel
  useEffect(() => {
    const fetchSysAttSubLabel = async () => {
      try {
        const res = await sysAttSubApi.getSysAttSubLabel();
        if (res.data && res.data?.data) {
          const sysAttSubLabel = getSysAttSubLabel(res.data?.data);
          setDataLabel(sysAttSubLabel);
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
    fetchSysAttSubLabel();
  }, []);

  // API - getItemSysAttSubLabel
  useEffect(() => {
    if (!idLabel) return;
    if (!tableName) return;

    setLoading(true);
    const fecthData = async () => {
      try {
        const res = await sysAttSubApi.getItemSysAttSubLabel({
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
                  <input
                    {...register('idLabel')}
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
                  </div>
                </div>

                {/* Sort */}
                <div className="form-group">
                  <label className="form-label" htmlFor="sort">
                    {dataLabel.sortUpdate?.name}
                  </label>
                  <input
                    {...register('sort')}
                    id="sort"
                    type="number"
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

                {/* Button action */}
                <div className="form-group">
                  <Button className="mr-2" type="button" variant="outline-danger" onClick={closeTab}>
                    {dataLabel.btnBackUpdate?.name || 'Back'}
                  </Button>
                  <Button type="submit" variant="primary">
                    {loading && (
                      <Spinner
                        style={{
                          width: '1.5rem',
                          height: '1.5rem',
                        }}
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

export default withAuth(withLayout(UpdateLabelSysAttSubModal));
