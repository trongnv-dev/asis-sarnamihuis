import { Button, Modal, Spinner } from '@blueupcode/components';
import { Switch } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { regionApi } from 'services';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { ChangeLabel } from 'components/UI/features';
import { get } from 'lodash';

const UpdateRegionModal = (props) => {
  const { id, title, setIsReloadData, isReloadData, setPopupUpdateRegion, countryId, parentId, readOnly } = props;
  const dataLabel = useSelector((state) => state.language.label);
  const isSwitch = useSelector((state) => state.page.isQuickEdit);

  const schema = yup.object().shape({
    country: yup.number().min(0, `sort can't not empty`),
    id: yup.number().min(1, 'id must over than 1').required(`id can't not empty`),
    sort: yup.number().typeError('you must specify a number'),
    isActive: yup.bool().required(`active can't not empty`),
    region: yup.array().of(
      yup.object().shape({
        region: yup.string().required(`region name can't empty`),
        idLanguage: yup.number().required(`idLanguage can't empty`),
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

  const updateRegion = async (formData) => {
    setLoading(true);
    try {
      const res = await regionApi.editItemRegion({
        id: formData.id,
        idCountry: countryId,
        parentId: parentId,
        sort: formData.sort,
        translate: formData.region,
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
    setPopupUpdateRegion(false);
  };

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await regionApi.getItemRegion(id);
        if (res?.data && res.data?.data) {
          setData(res.data.data);
        }
      } catch (e) {
        console.log(e);
        const errorMessage = get(e, response.data.error);
        swal.fire({ text: errorMessage || 'An occur error', icon: 'error' });
        setLoading(false);
        setPopupUpdateRegion(false);
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
            <form onSubmit={handleSubmit(updateRegion)}>
              <div className="form-group">
                <label for="country" className="form-label">
                  Country ID
                </label>
                <input
                  id={`country`}
                  {...register(`country`)}
                  className="form-control"
                  type="text"
                  defaultValue={countryId}
                  readOnly
                />
                {errors.country && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.country?.message}
                  </div>
                )}

                <label for="id" className="form-label">
                  Region ID
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
                <label for="id" className="form-label">
                  Partent ID
                </label>
                <input
                  id="parentId"
                  name="parentId"
                  {...register('parentId')}
                  type="text"
                  className="form-control"
                  defaultValue={parentId}
                  readOnly
                />
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
                          {...register(`region.${index}.idTranslate`)}
                          type="text"
                          defaultValue={item.idTranslate}
                          hidden
                        />
                        <input
                          {...register(`region.${index}.languageCode`)}
                          type="text"
                          defaultValue={item.languageCode}
                          hidden
                        />
                        <input
                          {...register(`region.${index}.languageIcon`)}
                          type="text"
                          defaultValue={item.languageIcon}
                          hidden
                        />
                        <input
                          {...register(`region.${index}.idLanguage`)}
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
                          {...register(`region.${index}.region`)}
                          className="form-control"
                          type="text"
                          defaultValue={item.region}
                          required
                          readOnly={readOnly}
                        />
                        {errors && errors[`region[${index}].region`] && (
                          <div style={{ display: 'block' }} className="invalid-feedback">
                            {errors[`region[${index}].region`]?.message}
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
                    onClick={() => setPopupUpdateRegion(false)}
                  >
                    <ChangeLabel label={readOnly ? dataLabel.btnCloseDetai : dataLabel.btnCloseUpdate} />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline-danger"
                    className={!readOnly ? 'mr-2' : 'float-right'}
                    onClick={() => setPopupUpdateRegion(false)}
                  >
                    {readOnly ? dataLabel.btnCloseDetail.name : dataLabel.btnCloseUpdate.name}
                  </Button>
                )}
                {isSwitch
                  ? !readOnly && (
                      <Button
                        type="submit"
                        variant="primary"
                        onClick={handleSubmit(updateRegion)}
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
                        onClick={handleSubmit(updateRegion)}
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

export default UpdateRegionModal;
