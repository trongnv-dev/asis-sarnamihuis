import React, { Fragment, useEffect, useState } from 'react';
import { Modal, Button, Spinner } from '@blueupcode/components';
import * as yup from 'yup';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import { useForm } from 'react-hook-form';
import {personApi} from 'services';
const ChangePassword = (props) => {
  const { setPopupChangePassword, id } = props;
  const schema = yup.object().shape({
    // idLabel: yup.number().min(1, 'id must over than 1').required(`id can't not empty`),
    password: yup.string().required(`old password can't empty`),
    confirmPassword: yup.string().required(`confirm password can't empty`),
    newPassword: yup.string().required(`new password can't empty`)
  });

  const formOptions = { resolver: yupResolver(schema) };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);


  const [loading, setLoading] = useState(false);
  const changePassword = async (data) => { 
    setLoading(true)
    if(data.newPassword != data.confirmPassword)
    swal.fire({ text: "Confirm password not match ", icon: "error" });
    else{
      try {
        const res = await personApi.editItemPerson({id:id, oldPassword: data.password, password: data.newPassword, confirmPassword: data.confirmPassword});
        if (res.status == 200) {
          swal.fire({ text: res.data.update, icon: 'success' });
          setPopupChangePassword(false);
        } else {
          swal.fire({ text: res.data.message, icon: 'error' });
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    }
    setLoading(false)
  }

  return (
    <Fragment>
      {/* BEGIN Modal */}
      <Modal isOpen={true}>
        <Modal.Header>Change password</Modal.Header>
        <Modal.Body>

          <form onSubmit={handleSubmit(changePassword)}>


            <div className="form-group">
              <label for="password" className="form-label">
                Old password
              </label>
              {/* <ShowAndHidePassword /> */}
              <input
              secureTextEntry={true}
                id="password"
                name="password"
                {...register('password')}
                type="password"
                className="form-control"
              />
              {errors.sort && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.password?.message}
                </div>
              )}

              <label for="newPassword" className="form-label">
                New password
              </label>
              <input
              secureTextEntry={true}
                id="newPassword"
                name="newPassword"
                {...register('newPassword')}
                type="password"
                className="form-control"
              // defaultValue={data.sort}
              />
              {errors.sort && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.newPassword?.message}
                </div>
              )}

              <label for="confirmPassword" className="form-label">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                {...register('confirmPassword')}
                type="password"
                className="form-control"
              // defaultValue={data.sort}
              />
              {errors.sort && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.confirmPassword?.message}
                </div>
              )}

            </div>


            <Button type="submit" variant="primary" onClick={handleSubmit(changePassword)} className="float-right">
                  {loading ? <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" /> : 'Save'}
                </Button>
            <Button type="button" variant="outline-danger" className="mr-2" onClick={() => setPopupChangePassword(false)} >
                  Close
            </Button>
          </form>

        </Modal.Body>

      </Modal>
      {/* END Modal */}
    </Fragment>
  );
};

export default ChangePassword;
