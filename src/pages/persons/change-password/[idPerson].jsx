import { useState } from 'react';
import { Container, Button, Spinner } from '@blueupcode/components';
import { CircularProgress, Typography } from '@mui/material';

import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/dist/client/router';

import * as yup from 'yup';

import { yupResolver } from 'components/validation/yupResolver';
import { swal } from 'components/swal/instance';

import { personApi } from 'services';
import styles from 'styles/pages/person-list.module.scss';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';

// Yup schema
const schema = yup.object().shape({
  oldPassword: yup.string().required(`old password can't empty`),
  confirmPassword: yup.string().required(`confirm password can't empty`),
  newPassword: yup.string().required(`new password can't empty`)
});

function ChangePassword() {
  const [data, setData] = useState({});

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { idPerson } = router.query;

  const closeTab = () => {
    router.back();
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

  // Update person
  const updatePassword = async (data) => {

    setLoading(true)
    if (data.newPassword != data.confirmPassword)
      swal.fire({ text: "Confirm password not match ", icon: "error" });
    else {
      try {
        const res = await personApi.editItemPerson({ id: idPerson, oldPassword: data.oldPassword, password: data.newPassword, confirmPassword: data.confirmPassword });
        if (res.status == 200) {
          swal.fire({ text: res.data.update, icon: 'success' });
        } else {
          swal.fire({ text: res.data.message, icon: 'error' });
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    }
    setLoading(false)
  };


  return (
    <>
      <Head>
        <title>Change password</title>
      </Head>
      <Container fluid>
        <form onSubmit={handleSubmit(updatePassword)}>
          {/* oldPassword */}
          <div className="form-group">
            <label className="form-label">Old password</label>
            <input {...register('oldPassword')} className="form-control" />
            {errors.oldPassword && (
              <div style={{ display: 'block' }} className="invalid-feedback">
                {errors.oldPassword?.message}
              </div>
            )}
          </div>

          {/* newPassword */}
          <div className="form-group">
            <label className="form-label">New password</label>
            <input {...register('newPassword')} className="form-control" />
            {errors.newPassword && (
              <div style={{ display: 'block' }} className="invalid-feedback">
                {errors.newPassword?.message}
              </div>
            )}
          </div>

          {/* confirmPassword */}
          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input {...register('confirmPassword')} className="form-control" />
            {errors.confirmPassword && (
              <div style={{ display: 'block' }} className="invalid-feedback">
                {errors.confirmPassword?.message}
              </div>
            )}
          </div>
          {/* Group action */}
          <div className="form-group">
            <Button type="button" variant="outline-danger" className="mr-2" onClick={closeTab}>
              Back
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
              Save
            </Button>
          </div>
        </form>

      </Container>
    </>
  );
}

export default withAuth(withLayout(ChangePassword));
