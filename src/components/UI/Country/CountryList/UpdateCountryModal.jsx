import { Button, Modal, Spinner } from '@blueupcode/components';
import { Switch } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import { ChangeLabel } from 'components/UI/features';
import { yupResolver } from 'components/validation/yupResolver';
import { get } from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { countryApi } from 'services';
import * as yup from 'yup';

const UpdateCountryModal = (props) => {
  const { id, title, setIsReloadData, isReloadData, setPopupUpdateCountry, readOnly } = props;
  const dataLabel = useSelector((state) => state.language.label);
  const isSwitch = useSelector((state) => state.page.isQuickEdit);

  const schema = yup.object().shape({
    id: yup.number().min(1, 'id must over than 1').required(`id can't not empty`),
    sort: yup.number().typeError('you must specify a number'),
    isActive: yup.bool().required(`active can't not empty`),
    country: yup.array().of(
      yup.object().shape({
        country: yup.string().required(`translate country name can't empty`),
        idLanguage: yup.number().required(`translate idLanguage can't empty`),
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

  const updateCountry = async (formData) => {
    setLoading(true);
    try {
      const res = await countryApi.editItemCountry({
        id: formData.id,
        sort: formData.sort,
        translate: formData.country,
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
    setPopupUpdateCountry(false);
  };

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await countryApi.getItemCountry(id);
        if (res?.data && res.data?.data) {
          setData(res.data.data);
        }
      } catch (e) {
        console.log(e);
        const errorMessage = get(e, response.data.error);
        swal.fire({ text: errorMessage || 'An occur error', icon: 'error' });
        setLoading(false);
        setPopupUpdateCountry(false);
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
            <form onSubmit={handleSubmit(updateCountry)}>
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
                          {...register(`country.${index}.idLanguage`)}
                          type="text"
                          defaultValue={item.idLanguage}
                          hidden
                        />
                        <span>
                          <img src={item.languageIcon} alt="icon" />
                          {'	'}
                          <label for={`trans_${item.id}`} className="form-label">
                            {item.nameLanguage}
                          </label>
                        </span>
                        <input
                          id={`trans_${item.id}`}
                          {...register(`country.${index}.country`)}
                          className="form-control"
                          type="text"
                          defaultValue={item.country}
                          required
                          readOnly={readOnly}
                        />
                        {errors && errors[`country[${index}].country`] && (
                          <div style={{ display: 'block' }} className="invalid-feedback">
                            {errors[`country[${index}].country`]?.message}
                          </div>
                        )}
                      </li>
                    ))}
                </div>
              </div>
              <div className="form-group">
                <label for="sort" className="form-label">
                  {readOnly ? dataLabel.sortDetail.name : dataLabel.sortUpdate.name}
                </label>
                <input
                  id="sort"
                  name="sort"
                  {...register('sort')}
                  type="number"
                  className="form-control"
                  defaultValue={data.sort}
                  min={1}
                  max={50}
                  step={1}
                  readOnly={readOnly}
                />
                {errors.sort && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.sort?.message}
                  </div>
                )}
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
              <div className="form-group">
                {isSwitch ? (
                  <Button
                    type="button"
                    variant="outline-danger"
                    className={!readOnly ? 'mr-2' : 'float-right'}
                    onClick={() => setPopupUpdateCountry(false)}
                  >
                    <ChangeLabel label={readOnly ? dataLabel.btnCloseDetail : dataLabel.btnCloseUpdate} />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline-danger"
                    className={!readOnly ? 'mr-2' : 'float-right'}
                    onClick={() => setPopupUpdateCountry(false)}
                  >
                    {readOnly ? dataLabel.btnCloseDetail.name : dataLabel.btnCloseUpdate.name}
                  </Button>
                )}

                {isSwitch
                  ? !readOnly && (
                      <Button
                        type="submit"
                        variant="primary"
                        onClick={handleSubmit(updateCountry)}
                        className="float-right"
                      >
                        {loading ? (
                          <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />
                        ) : (
                          <ChangeLabel label={readOnly ? dataLabel.btnSaveDetail : dataLabel.btnSaveUpdate} />
                        )}
                      </Button>
                    )
                  : !readOnly && (
                      <Button
                        type="submit"
                        variant="primary"
                        onClick={handleSubmit(updateCountry)}
                        className="float-right"
                      >
                        {loading ? (
                          <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />
                        ) : readOnly ? (
                          dataLabel.btnSaveDetail.name
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

export default UpdateCountryModal;
