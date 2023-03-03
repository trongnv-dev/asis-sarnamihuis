import { Button, Modal, Spinner } from '@blueupcode/components';
import { Switch } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { genderApi } from 'services';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { ChangeLabel } from 'components/UI/features';

const CreateGenderModal = (props) => {
  const { title, setIsReloadData, isReloadData, setPopupCreateGender } = props;
  const languages = useSelector((state) => state.language.listLanguageActive);
  const dataLabel = useSelector((state) => state.language.label);
  const isSwitch = useSelector((state) => state.page.isQuickEdit);

  const schema = yup.object().shape({
    sort: yup.number().typeError('you must specify a number'),

    gender: yup.array().of(
      yup.object().shape({
        name: yup.string().required(`gender name can't empty`),
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

  const createGender = async (formData) => {
    setLoading(true);
    try {
      const res = await genderApi.createItemGender({
        sort: formData.sort,
        gender: formData.gender,
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
    setPopupCreateGender(false);
  };

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      try {
        let genderData = languages.map((item) => {
          return {
            idLanguage: item.idLanguage,
            nameLanguage: item.name,
            iconLanguage: item.icon,
          };
        });

        let dataValue = {
          sort: 50,
          gender: genderData,
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
        <Modal.Header>{dataLabel.textTitleCreate.name}</Modal.Header>
        <Modal.Body>
          {loading && (
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          )}
          <form onSubmit={handleSubmit(createGender)}>
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
                {data.gender &&
                  data.gender.map((item, index) => (
                    <li className="list-group-item">
                      <span>
                        <img src={item.iconLanguage} alt="icon" />
                        {'	'}
                        <label for={`gender_${item.idLanguage}`} className="form-label">
                          {item.nameLanguage}
                        </label>
                      </span>
                      <input
                        id={`gender_${item.idLanguage}`}
                        {...register(`gender.${index}.idLanguage`)}
                        className="form-control"
                        type="text"
                        defaultValue={item.idLanguage}
                        hidden
                      />
                      <input
                        id={`gender_${item.name}`}
                        {...register(`gender.${index}.name`)}
                        className="form-control"
                        type="text"
                        defaultValue={item.name == null ? '' : item.name}
                        required
                      />
                      {errors && errors[`gender[${index}].name`] && (
                        <div style={{ display: 'block' }} className="invalid-feedback">
                          {errors[`gender[${index}].name`]?.message}
                        </div>
                      )}
                    </li>
                  ))}
              </div>
            </div>
            <div className="form-group">
              <label for="sort" className="form-label">
                {dataLabel.sortCreate.name}
              </label>
              <input
                id="sort"
                name="sort"
                {...register('sort')}
                type="number"
                className="form-control"
                // defaultValue={data.sort}
                defaultValue={50}
                min={1}
                max={50}
                step={1}
              />
              {errors.sort && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.sort?.message}
                </div>
              )}
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
              <Button
                type="button"
                variant="outline-danger"
                className="mr-2"
                onClick={() => setPopupCreateGender(false)}
              >
                {isSwitch ? <ChangeLabel label={dataLabel.btnCloseCreate} /> : dataLabel.btnCloseCreate.name}
              </Button>
              <Button type="submit" variant="primary" onClick={handleSubmit(createGender)} className="float-right">
                {loading ? (
                  <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />
                ) : isSwitch ? (
                  <ChangeLabel label={dataLabel.btnSaveCreate} />
                ) : (
                  dataLabel.btnSaveCreate.name
                )}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {/* END Modal */}
    </Fragment>
  );
};

export default CreateGenderModal;
