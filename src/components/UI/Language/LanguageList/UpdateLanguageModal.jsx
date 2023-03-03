import { Button, Modal, Spinner } from '@blueupcode/components';
import { Switch } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { languageApi } from 'services';
import { setLanguage } from 'store/actions';
import * as yup from 'yup';
import { ChangeLabel } from 'components/UI/features';
import { get } from 'lodash';

const UpdateLanguageModal = (props) => {
  const { id, title, setIsReloadData, isReloadData, setPopupUpdateLanguage, readOnly } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const currentLanguage = useSelector((state) => state.language.currentLanguage);
  const dataLabel = useSelector((state) => state.language.label);
  const isSwitch = useSelector((state) => state.page.isQuickEdit);

  function isDeactive(id, isActive) {
    if (id === currentLanguage.id) {
      const newData = { ...data, isActive: true };
      setData(newData);
      swal.fire({ text: 'currently selected language cannot be deactivated', icon: 'error' });
    } else {
      const newData = { ...data, isActive: !isActive };
      setData(newData);
    }
  }

  const schema = yup.object().shape({
    id: yup.number().min(1, 'id must over than 1').required(`id can't not empty`),
    code: yup.string().required(`code can't not empty`),
    culture: yup.string(),
    icon: yup.string(),
    sort: yup.number().typeError('you must specify a number'),
    dateFormat: yup.string().required(`date format can't not empty`),
    isActive: yup.bool().required(`active can't not empty`),
    translate: yup.array().of(
      yup.object().shape({
        id: yup.number().min(1, 'translate id must be over than 1').required(`translate id can't empty`),
        name: yup.string().required(`translate name can't empty`),
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

  const updateLanguage = async (data) => {
    setLoading(true);
    try {
      const res = await languageApi.editItemLanguage({
        id: data.id,
        code: data.code,
        culture: data.culture,
        icon: data.icon,
        sort: data.sort,
        dateFormat: data.dateFormat,
        isActive: data.isActive,
        translate: data.translate,
      });

      if (res.status == 200) {
        dispatch(setLanguage());
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
    setPopupUpdateLanguage(false);
  };

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await languageApi.getItemLanguage(id);
        if (res?.data && res.data?.data) {
          setData(res.data.data);
        }
      } catch (e) {
        console.log(e);
        const errorMessage = get(e, response.data.error);
        swal.fire({ text: errorMessage || 'An occur error', icon: 'error' });
        setLoading(false);
        setPopupUpdateLanguage(false);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <Fragment>
      {/* BEGIN Modal */}
      <Modal isOpen={true}>
        <Modal.Header>{readOnly ? dataLabel.textTitleDetail.name : dataLabel.textTitleUpdate.name}</Modal.Header>
        <Modal.Body>
          {loading && (
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          )}
          {data.id && (
            <form onSubmit={handleSubmit(updateLanguage)}>
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
                        <input {...register(`translate.${index}.id`)} type="text" defaultValue={item.id} hidden />
                        <input
                          {...register(`translate.${index}.idLanguage`)}
                          type="text"
                          defaultValue={item.idLanguage}
                          hidden
                        />
                        <span>
                          <img src={item.icon} alt="icon" />
                          {'	'}
                          <label for={`trans_${item.id}`} className="form-label">
                            {item.nameLanguage}
                          </label>
                        </span>
                        <input
                          id={`trans_${item.id}`}
                          {...register(`translate.${index}.name`)}
                          className="form-control"
                          type="text"
                          defaultValue={item.name}
                          required
                          readOnly={readOnly}
                        />
                        {errors.translate && (
                          <div style={{ display: 'block' }} className="invalid-feedback">
                            {errors.translate.index?.name?.message}
                          </div>
                        )}
                      </li>
                    ))}
                </div>
              </div>
              <div className="form-group">
                <label for="code" className="form-label">
                  {readOnly ? dataLabel.codeDetail.name : dataLabel.codeUpdate.name}
                </label>
                <input
                  id="code"
                  {...register('code')}
                  type="text"
                  className="form-control"
                  defaultValue={data.code}
                  readOnly
                />
                {errors.code && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.code?.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label for="culture" className="form-label">
                  {readOnly ? dataLabel.cultureDetail.name : dataLabel.cultureUpdate.name}
                </label>
                <input
                  id="culture"
                  {...register('culture')}
                  type="text"
                  className="form-control"
                  defaultValue={data.culture}
                  readOnly
                />
                {errors.culture && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.culture?.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label for="dateFormat" className="form-label">
                  {readOnly ? dataLabel.dateFormatDetail.name : dataLabel.dateFormatUpdate.name}
                </label>
                <input
                  id="dateFormat"
                  {...register('dateFormat')}
                  type="text"
                  className="form-control"
                  defaultValue={data.dateFormat}
                  readOnly={readOnly}
                />
                {errors.dateFormat && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.dateFormat?.message}
                  </div>
                )}
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
                <label for="icon" className="form-label" hidden>
                  {readOnly ? dataLabel.sortDetail.name : dataLabel.iconUpdate.name}
                </label>
                {'		'}
                <input id="icon" name="icon" {...register('icon')} defaultValue={data.icon} hidden />
                <img src={data.icon} alt="icon" hidden />
              </div>
              <div className="form-group">
                <label for="isActive" className="form-label">
                  {readOnly ? dataLabel.isActiveDetail.name : dataLabel.isActiveUpdate.name}
                </label>
                <Switch
                  id="isActive"
                  {...register('isActive')}
                  size="lg"
                  checked={data.isActive}
                  color="primary"
                  onChange={() => isDeactive(data.id, data.isActive)}
                  disabled={readOnly}
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
                  className={!readOnly ? 'mr-2' : 'float-right'}
                  onClick={() => setPopupUpdateLanguage(false)}
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
                    onClick={handleSubmit(updateLanguage)}
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

export default UpdateLanguageModal;
