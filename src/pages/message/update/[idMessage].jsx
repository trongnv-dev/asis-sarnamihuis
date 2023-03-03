import { useRouter } from 'next/dist/client/router';
import { messageApi } from 'services';
import { getMessageList } from 'utils/label';
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
import URL from 'config/api-url';

// yup - schema
const schema = yup.object().shape({
  translate: yup.array().of(
    yup.object().shape({
      message: yup.string().required(`Translate name can not empty`),
    })
  ),
});

function UpdateMessageModal() {
  const router = useRouter();
  const { idMessage } = router.query;

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [dataLabel, setDataLabel] = useState([]);
  const [data, setData] = useState({});

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

  // Update message
  const updateMessage = async (formData) => {
    setLoading(true);

    try {
      const res = await messageApi.editItemMessage({
        id: data.id,
        code: data.code, //  formData.code
        translate: formData.translate,
      });
      if (res.status === 200) {
        await swal.fire({ text: res.statusText || 'Update success', icon: 'success' });
      } else {
        swal.fire({ text: res.statusText || 'Update failed', icon: 'error' });
      }
    } catch (e) {
      console.log(e);
      swal.fire({ text: e, icon: 'error' });
    }
    setLoading(false);
  };

  // Close tab
  const closeTab = () => {
    router.back();
  };

  // API - getItemMessage
  useEffect(() => {
    if (!idMessage) return;
    setLoading(true);
    const fetchItemMessage = async () => {
      try {
        const res = await messageApi.getItemMessage(idMessage);
        if (res.data && res.data?.data) {
          setData(res.data.data);
        } else {
          swal.fire({ text: res.statusText, icon: 'error' });
        }
      } catch (e) {
        console.log(e);
        swal.fire({ text: e, icon: 'error' });
      }
      setLoading(false);
    };
    fetchItemMessage();
  }, []);

  // API - getMessageLabel
  useEffect(() => {
    const fetchMessageLabel = async () => {
      try {
        const res = await messageApi.getMessageLabel();
        if (res.data && res.data?.data) {
          const messageLabel = getMessageList(res.data.data);
          setDataLabel(messageLabel);
        } else {
          swal.fire({ text: res.statusText, icon: 'error' });
        }
      } catch (e) {
        console.log(e);
        swal.fire({ text: e, icon: 'error' });
      }
      setPageLoading(false);
    };

    fetchMessageLabel();
  }, []);

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
            {data.id && (
              <form onSubmit={handleSubmit(updateMessage)}>
                {/* id */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.idUpdate?.name}</label>
                  <input className="form-control" defaultValue={data.id} readOnly />
                </div>
                {/* code */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.codeUpdate?.name}</label>
                  <input className="form-control" defaultValue={data.code} readOnly />
                </div>
                {/* translate */}
                <div className="form-group">
                  <label className="form-label">Translate</label>
                  <ul
                    className="list-group"
                    style={{
                      maxHeight: 200,
                      overflowY: 'scroll',
                    }}
                  >
                    {data.translate?.map((item, index) => (
                      <li className="list-group-item" key={item.idLanguage}>
                        <input
                          {...register(`translate.${index}.id`)}
                          className="form-control"
                          defaultValue={item.id}
                          hidden
                        />
                        <input
                          {...register(`translate.${index}.idLanguage`)}
                          className="form-control"
                          defaultValue={item.idLanguage}
                          hidden
                        />
                        <span>
                          <img src={`${URL.BASE_URL + item.icon}`} alt="icon" className="mr-2 mb-1" />
                          <label className="form-label">{item.nameLanguage}</label>
                        </span>
                        <input
                          {...register(`translate.${index}.message`)}
                          className="form-control"
                          defaultValue={item.message}
                        />
                        {errors[`translate[${index}].message`] && (
                          <div className="invalid-feedback" style={{ display: 'block' }}>
                            {errors[`translate[${index}].message`]?.message}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Actions */}
                <div className="form-group">
                  <Button variant="outline-danger" type="button" className="mr-2" onClick={closeTab}>
                    {dataLabel.btnBackUpdate?.name}
                  </Button>
                  <Button variant="primary" type="submit">
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

export default withAuth(withLayout(UpdateMessageModal));
