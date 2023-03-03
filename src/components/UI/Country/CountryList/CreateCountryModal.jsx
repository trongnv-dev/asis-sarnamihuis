import { Button, Modal, Spinner } from '@blueupcode/components';
import { Switch } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { countryApi } from 'services';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { ChangeLabel } from 'components/UI/features';

const CreateCountryModal = (props) => {
  const { title, setIsReloadData, isReloadData, setPopupCreateCountry } = props;
  const languages = useSelector((state) => state.language.listLanguageActive);
  const dataLabel = useSelector((state) => state.language.label);
  const isSwitch = useSelector((state) => state.page.isQuickEdit);

  const schema = yup.object().shape({
    sort: yup.number().typeError('you must specify a number'),
    country: yup.array().of(
      yup.object().shape({
        country: yup.string().required(`country name can't empty`),
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

  const createCountry = async (formData) => {
    setLoading(true);
    try {
      const res = await countryApi.createItemCountry({
        sort: formData.sort,
        country: formData.country,
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
    setPopupCreateCountry(false);
  };

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      let countryData = languages.map((item) => {
        return {
          idLanguage: item.idLanguage,
          nameLanguage: item.name,
          iconLanguage: item.icon,
        };
      });

      let dataValue = {
        sort: 50,
        country: countryData,
      };
      setData(dataValue);

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
          <form onSubmit={handleSubmit(createCountry)}>
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
                {data.country &&
                  data.country.map((item, index) => (
                    <li className="list-group-item">
                      <span>
                        <img src={item.iconLanguage} alt="icon" />
                        {'	'}
                        <label for={`country_${item.idLanguage}`} className="form-label">
                          {item.nameLanguage}
                        </label>
                      </span>
                      <input
                        id={`country_${item.idLanguage}`}
                        {...register(`country.${index}.idLanguage`)}
                        className="form-control"
                        type="text"
                        defaultValue={item.idLanguage}
                        hidden
                      />
                      <input
                        id={`country_${item.country}`}
                        {...register(`country.${index}.country`)}
                        className="form-control"
                        type="text"
                        defaultValue={item.country == null ? '' : item.country}
                        required
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
              {isSwitch ? (
                <Button
                  type="button"
                  variant="outline-danger"
                  className="mr-2"
                  onClick={() => setPopupCreateCountry(false)}
                >
                  <ChangeLabel label={dataLabel.btnCloseCreate} />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline-danger"
                  className="mr-2"
                  onClick={() => setPopupCreateCountry(false)}
                >
                  {dataLabel.btnCloseCreate.name}
                </Button>
              )}
              {isSwitch ? (
                <Button type="submit" variant="primary" onClick={handleSubmit(createCountry)} className="float-right">
                  {loading ? (
                    <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />
                  ) : (
                    <ChangeLabel label={dataLabel.btnSaveCreate} />
                  )}
                </Button>
              ) : (
                <Button type="submit" variant="primary" onClick={handleSubmit(createCountry)} className="float-right">
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

export default CreateCountryModal;
