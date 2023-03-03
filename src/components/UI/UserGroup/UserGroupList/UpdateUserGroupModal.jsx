import { Button, Modal, Spinner } from '@blueupcode/components';
import { Switch } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { userGroupApi } from 'services';
import * as yup from 'yup';
import URL from 'config/api-url';
import { useSelector } from 'react-redux';
import { ChangeLabel } from 'components/UI/features';
import { get } from 'lodash';

const UpdateUserGroupModal = (props) => {
  const { id, title, setIsReloadData, isReloadData, setPopupUpdateUserGroup, readOnly } = props;
  const dataLabel = useSelector((state) => state.language.label);
  const isSwitch = useSelector((state) => state.page.isQuickEdit);

  const schema = yup.object().shape({
    id: yup.number().min(1, 'id must over than 1').required(`id can't not empty`),
    isActive: yup.bool().required(`active can't not empty`),
    groupTitle: yup.string().required(`group title can't empty`),
    userGroup: yup.array().of(
      yup.object().shape({
        name: yup.string().required(`group name name can't empty`),
        description: yup.string().max(100, 'description maximun 100 characters'),
      })
    ),
  });

  const formOptions = { resolver: yupResolver(schema) };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const updateUserGroup = async (formData) => {
    setLoading(true);
    try {
      const res = await userGroupApi.editItemUserGroup({
        groupTitle: formData.groupTitle,
        id: formData.id,
        translate: formData.userGroup,
        isActive: formData.isActive,
        isActiveAdmin: formData.isActiveAdmin,
      });

      if (res.status == 200) {
        setIsReloadData(!isReloadData);
        swal.fire({ text: res.data.update, icon: 'success' });
      } else {
        swal.fire({ text: 'network error', icon: 'error' });
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
    setLoading(false);
    setPopupUpdateUserGroup(false);
  };

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await userGroupApi.getItemUserGroup(id);
        if (res?.data && res.data?.data) {
          setData(res.data.data);
        }
      } catch (e) {
        console.log(e);
        const errorMessage = get(e, response.data.error);
        swal.fire({ text: errorMessage || 'An occur error', icon: 'error' });
        setLoading(false);
        setPopupUpdateUserGroup(false);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <Fragment>
      {/* BEGIN Modal */}
      <Modal isOpen={true}>
        <Modal.Header>{readOnly ? dataLabel.titlePageDetail.name : dataLabel.titlePageUpdate.name}</Modal.Header>
        <Modal.Body>
          {loading && (
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          )}
          {data.id && (
            <form onSubmit={handleSubmit(updateUserGroup)}>
              <div className="form-group">
                <label for="id" className="form-label">
                  {readOnly ? dataLabel.idDetail.name : dataLabel.idUpdate.name}
                </label>
                <input
                  id="id"
                  name="id"
                  {...register('id')}
                  type="text"
                  className="form-control"
                  defaultValue={data.id}
                  readOnly
                />
                {errors.id && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.id?.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label for="groupTitle" className="form-label">
                  {readOnly ? dataLabel.groupTitleDetail.name : dataLabel.groupTitleUpdate.name}
                </label>
                <input
                  id="groupTitle"
                  name="groupTitle"
                  {...register('groupTitle')}
                  type="text"
                  className="form-control"
                  defaultValue={data.groupTitle}
                  readOnly={readOnly}
                />
                {errors.groupTitle && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.groupTitle.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Translate</label>
                <div
                  className="list-group"
                  style={{
                    maxHeight: 240,
                    overflowY: 'scroll',
                    scrollbarWidth: 'thin',
                  }}
                >
                  {data.translate &&
                    data.translate.map((item, index) => (
                      <li className="list-group-item">
                        <input
                          {...register(`userGroup.${index}.idLanguage`)}
                          type="text"
                          defaultValue={item.idLanguage}
                          hidden
                        />
                        <span>
                          <img src={URL.BASE_URL + item.languageIcon} alt="icon" />
                          {'	'}
                          <label for={`trans_${item.id}`} className="form-label">
                            {item.languageCode}
                          </label>
                        </span>
                        <div className="form-group">
                          <label for={`userGroup_${item.name}`} className="form-label">
                            {readOnly ? dataLabel.nameDetail.name : dataLabel.nameUpdate.name}
                          </label>
                          <input
                            id={`trans_${item.id}`}
                            {...register(`userGroup.${index}.name`)}
                            className="form-control"
                            type="text"
                            defaultValue={item.name}
                            required
                            readOnly={readOnly}
                          />
                          {errors && errors[`userGroup[${index}].name`] && (
                            <div style={{ display: 'block' }} className="invalid-feedback">
                              {errors[`userGroup[${index}].name`]?.message}
                            </div>
                          )}
                        </div>
                        <div className="form-group">
                          <label for={`userGroup_${item.description}`} className="form-label">
                            {readOnly ? dataLabel.descriptionDetail.name : dataLabel.descriptionUpdate.name}
                          </label>
                          <input
                            id={`userGroup_${item.description}`}
                            {...register(`userGroup.${index}.description`)}
                            className="form-control"
                            type="text"
                            defaultValue={item.description}
                            readOnly={readOnly}
                          />
                          {errors && errors[`userGroup[${index}].description`] && (
                            <div style={{ display: 'block' }} className="invalid-feedback">
                              {errors[`userGroup[${index}].description`]?.message}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                </div>
              </div>
              <div className="form-group">
                <label for="isActive" className="form-label">
                  {readOnly ? dataLabel.isActiveDetail.name : dataLabel.isActiveUpdate.name}
                </label>
                <Switch
                  id="isActive"
                  {...register('isActive')}
                  size="lg"
                  defaultChecked={data.isActive}
                  color="primary"
                  disabled={readOnly}
                />
                {errors.isActive && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.isActive?.message}
                  </div>
                )}
              </div>
              <div className="form-group" hidden>
                <Switch
                  id="isActiveAdmin"
                  {...register('isActiveAdmin')}
                  size="lg"
                  defaultChecked={data.idActiveAdmin}
                  color="primary"
                />
              </div>
              <div className="form-group">
                <Button
                  type="button"
                  variant="outline-danger"
                  className={!readOnly ? 'mr-2' : 'float-right'}
                  onClick={() => setPopupUpdateUserGroup(false)}
                >
                  {isSwitch ? (
                    <ChangeLabel label={readOnly ? dataLabel.btnCloseDetail : dataLabel.btnCloseUpdate} />
                  ) : readOnly ? (
                    dataLabel.btnCloseDetail.name
                  ) : (
                    dataLabel.btnCloseUpdate.name
                  )}
                </Button>
                {!readOnly && (
                  <Button
                    type="submit"
                    variant="primary"
                    onClick={handleSubmit(updateUserGroup)}
                    className="float-right"
                  >
                    {loading ? (
                      <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />
                    ) : isSwitch ? (
                      <ChangeLabel label={dataLabel.btnSaveUpdate} />
                    ) : (
                      dataLabel.btnSaveUpdate.name
                    )}
                  </Button>
                )}
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>
      {/* END Modal */}
    </Fragment>
  );
};

export default UpdateUserGroupModal;
