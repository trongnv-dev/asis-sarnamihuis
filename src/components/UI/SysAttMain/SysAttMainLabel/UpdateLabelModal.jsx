import { Button, Modal, Spinner } from '@blueupcode/components';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import URL from 'config/api-url';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { sysAttMainApi } from 'services';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { ChangeLabel } from 'components/UI/features';
import { get } from 'lodash';

const UpdateLabelModal = (props) => {
  const { id, sort, title, tableName, setIsReloadData, isReloadData, setPopupUpdate, readOnly } = props;
  const dataLabel = useSelector((state) => state.language.label);
  const isSwitch = useSelector((state) => state.page.isQuickEdit);

  const schema = yup.object().shape({
    idLabel: yup.number().min(1, 'id must over than 1').required(`id can't not empty`),
    sort: yup.number().typeError('you must specify a number'),
    translate: yup.array().of(
      yup.object().shape({
        label: yup.string().required(`label can't empty`),
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

  const updateLabel = async (data) => {
    setLoading(true);
    try {
      const res = await sysAttMainApi.editSysAttMainLabel({
        idLabel: data.idLabel,
        sort: data.sort,
        table: tableName,
        translate: data.translate,
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
    setPopupUpdate(false);
  };

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await sysAttMainApi.getItemSysAttMainLabel({ id, tableName });
        if (res?.data) {
          const tmp = {
            idLabel: id,
            sort: sort,
            translate: res.data,
          };
          setData(tmp);
        }
      } catch (e) {
        console.log(e);
        const errorMessage = get(e, response.data.error);
        swal.fire({ text: errorMessage || 'An occur error', icon: 'error' });
        setLoading(false);
        setPopupUpdate(false);
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
          {data.idLabel && (
            <form onSubmit={handleSubmit(updateLabel)}>
              <div className="form-group">
                <label for="idLabel" className="form-label">
                  {readOnly ? dataLabel.idDetail.name : dataLabel.idUpdate.name}
                </label>
                <input
                  id="idLabel"
                  name="idLabel"
                  {...register('idLabel')}
                  type="text"
                  className="form-control"
                  defaultValue={data.idLabel}
                  readOnly
                />
                {errors.idLabel && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.idLabel?.message}
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
                        <span>
                          <img src={URL.BASE_URL + item.icon} alt="icon" />
                          {'	'}
                        </span>
                        <input
                          id={`trans_${item.idLanguage}`}
                          {...register(`translate.${index}.idLanguage`)}
                          className="form-control"
                          type="text"
                          defaultValue={item.idLanguage}
                          hidden
                        />
                        <input
                          id={`trans_${item.label}`}
                          {...register(`translate.${index}.label`)}
                          className="form-control"
                          type="text"
                          defaultValue={item.label == null ? '' : item.label}
                          required
                          readOnly={readOnly}
                        />
                        {errors && errors[`translate[${index}].label`] && (
                          <div style={{ display: 'block' }} className="invalid-feedback">
                            {errors[`translate[${index}].label`]?.message}
                          </div>
                        )}
                      </li>
                    ))}
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
              </div>

              <div className="form-group">
                {isSwitch ? (
                  <ChangeLabel label={readOnly ? dataLabel.btnCloseDetail : dataLabel.btnCloseUpdate} />
                ) : (
                  <Button
                    type="button"
                    variant="outline-danger"
                    className={!readOnly ? 'mr-2' : 'float-right'}
                    onClick={() => setPopupUpdate(false)}
                  >
                    {readOnly ? dataLabel.btnCloseDetail.name : dataLabel.btnCloseUpdate.name}
                  </Button>
                )}
                {isSwitch ? (
                  <ChangeLabel label={dataLabel.btnSaveUpdate} />
                ) : (
                  !readOnly && (
                    <Button type="submit" variant="primary" onClick={handleSubmit(updateLabel)} className="float-right">
                      {loading ? (
                        <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />
                      ) : (
                        dataLabel.btnSaveUpdate.name
                      )}
                    </Button>
                  )
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

export default UpdateLabelModal;
