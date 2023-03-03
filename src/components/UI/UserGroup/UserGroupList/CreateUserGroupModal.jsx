import { Button, Modal, Spinner } from '@blueupcode/components';
import { Switch } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { userGroupApi } from 'services';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { ChangeLabel } from 'components/UI/features';

const CreateUserGroupModal = (props) => {
  const { title, setIsReloadData, isReloadData, setPopupCreateUserGroup } = props;
  const languages = useSelector((state) => state.language.listLanguageActive);
  const dataLabel = useSelector((state) => state.language.label);
  const isSwitch = useSelector((state) => state.page.isQuickEdit);

  const schema = yup.object().shape({
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

  const createUserGroup = async (formData) => {
    setLoading(true);
    try {
      const res = await userGroupApi.createItemUserGroup({
        groupTitle: formData.groupTitle,
        translate: formData.userGroup,
        isActive: formData.isActive,
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
    setPopupCreateUserGroup(false);
  };

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      try {
        let userGroupData = languages.map((item) => {
          return {
            idLanguage: item.idLanguage,
            nameLanguage: item.name,
            iconLanguage: item.icon,
          };
        });

        let dataValue = {
          userGroup: userGroupData,
        };
        setData(dataValue);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <Fragment>
      {/* BEGIN Modal */}
      <Modal isOpen={true}>
        <Modal.Header>{dataLabel.titlePageCreate.name}</Modal.Header>
        <Modal.Body>
          {loading && (
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          )}
          <form onSubmit={handleSubmit(createUserGroup)}>
            <div className="form-group">
              <label for="groupTitle" className="form-label">
                {dataLabel.groupTitleCreate.name}
              </label>
              <input
                id="groupTitle"
                name="groupTitle"
                {...register('groupTitle')}
                type="text"
                className="form-control"
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
                {data.userGroup &&
                  data.userGroup.map((item, index) => (
                    <li className="list-group-item">
                      <span>
                        <img src={item.iconLanguage} alt="icon" />
                        {'	'}
                        <label for={`userGroup_${item.idLanguage}`} className="form-label">
                          {item.nameLanguage}
                        </label>
                      </span>
                      <input
                        id={`userGroup_${item.idLanguage}`}
                        {...register(`userGroup.${index}.idLanguage`)}
                        className="form-control"
                        type="text"
                        defaultValue={item.idLanguage}
                        hidden
                      />
                      <div className="form-group">
                        <label for={`userGroup_${item.name}`} className="form-label">
                          {dataLabel.nameCreate.name}
                        </label>
                        <input
                          id={`userGroup_${item.name}`}
                          {...register(`userGroup.${index}.name`)}
                          className="form-control"
                          type="text"
                          required
                        />
                        {errors && errors[`userGroup[${index}].name`] && (
                          <div style={{ display: 'block' }} className="invalid-feedback">
                            {errors[`userGroup[${index}].name`]?.message}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label for={`userGroup_${item.description}`} className="form-label">
                          {dataLabel.descriptionCreate.name}
                        </label>
                        <input
                          id={`userGroup_${item.description}`}
                          {...register(`userGroup.${index}.description`)}
                          className="form-control"
                          type="text"
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
                {dataLabel.isActiveCreate.name}
              </label>
              <Switch
                id="isActive"
                {...register('isActive')}
                size="lg"
                defaultChecked={data.isActive}
                color="primary"
              />
              {errors.isActive && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.isActive?.message}
                </div>
              )}
            </div>
            <div className="form-group">
              {isSwitch ? (
                <Button
                  type="button"
                  variant="outline-danger"
                  className="mr-2"
                  onClick={() => setPopupCreateUserGroup(false)}
                >
                  <ChangeLabel label={dataLabel.btnCloseCreate} />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline-danger"
                  className="mr-2"
                  onClick={() => setPopupCreateUserGroup(false)}
                >
                  {dataLabel.btnCloseCreate.name}
                </Button>
              )}
              {isSwitch ? (
                <Button type="submit" variant="primary" onClick={handleSubmit(createUserGroup)} className="float-right">
                  {loading ? (
                    <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />
                  ) : (
                    <ChangeLabel label={dataLabel.btnSaveCreate} />
                  )}
                </Button>
              ) : (
                <Button type="submit" variant="primary" onClick={handleSubmit(createUserGroup)} className="float-right">
                  {loading ? (
                    <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />
                  ) : (
                    dataLabel.btnSaveCreate.name
                  )}
                </Button>
              )}
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {/* END Modal */}
    </Fragment>
  );
};

export default CreateUserGroupModal;
