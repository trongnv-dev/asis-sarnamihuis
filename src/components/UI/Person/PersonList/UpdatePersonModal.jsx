import { Button, Spinner } from '@blueupcode/components';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import React, { Fragment, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { countryApi, genderApi, personApi, regionApi } from 'services';
import * as yup from 'yup';
import SelectInput from '../../features/SelectInput';
import { ChangeLabel } from 'components/UI/features';
import { useSelector } from 'react-redux';
import { get } from 'lodash';

const phoneRegExp = /^0[0-9]{9}$|^(?![\s\S])/;

const UpdatePersonModal = (props) => {
  const { id, title, setIsReloadData, isReloadData, setPopupUpdatePerson, readOnly } = props;
  const dataLabel = useSelector((state) => state.language.label);
  const isSwitch = useSelector((state) => state.page.isQuickEdit);
  const schema = yup.object().shape({
    lastName: yup.string().required(`last name can't empty`),
    middleName: yup.string().required(`middle name can't empty`),
    firstName: yup.string().required(`first name can't empty`),
    address: yup.string().required(`addressan't empty`),
    zipcode: yup.string().required(`zipcode an't empty`),
    place: yup.string().required(`place can't empty`),
    telephone1: yup.string().required(`telephone1 name can't empty`).matches(phoneRegExp, 'Phone number is not valid'),
    telephone2: yup.string().required(`telephone2 name can't empty`).matches(phoneRegExp, 'Phone number is not valid'),
    email1: yup.string().required(`email1 name can't empty`).email('email1 invalid format'),
    email2: yup.string().required(`email2 name can't empty`).email('email2 invalid format'),
    wantsNewsletter: yup
      .number()
      .required(`wantsNewsletter name can't empty`)
      .typeError(`wantsNewsletter nust be an integer`),
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

  const [relGenderOptions, setRelGenderOptions] = useState([]);
  const [relGenderSelected, setRelGenderSelected] = useState(null);
  const [relGenderDefault, setRelGenderDefault] = useState(null);

  const [regionOptions, setRegionOptions] = useState([]);
  const [regionSelected, setRegionSelected] = useState(null);

  const [countryOptions, setCountryOptions] = useState([]);
  const [countrySelected, setCountrySelected] = useState(null);

  const [relPersonOptions, setRelPersonOptions] = useState([]);
  const [relPersonSelected, setRelPersonSelected] = useState(null);

  const [submitStatus, setSubmitStatus] = useState(false);

  const updatePerson = async (formData) => {
    setLoading(true);
    if (relGenderSelected == null) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let tmp = {
      id: id,
      lastName: formData.lastName,
      middleName: formData.middleName,
      firstName: formData.firstName,
      idRelGender: Number(relGenderSelected),
      address: formData.address,
      zipcode: formData.zipcode,
      place: formData.place,
      idCountry: Number(countrySelected),
      idRegion: Number(regionSelected),
      telephone1: formData.telephone1,
      telephone2: formData.telephone2,
      email1: formData.email1,
      email2: formData.email2,
      memo: formData.memo,
      memoAdministration: formData.memoAdministration,
      wantsNewsletter: formData.wantsNewsletter,
      idRelPersonUpload: Number(relPersonSelected),
    };
    if (countrySelected == null || countrySelected == -1) delete tmp.idCountry;
    if (regionSelected == null || regionSelected == -1) delete tmp.idRegion;
    if (relPersonSelected == null || relPersonSelected == -1) delete tmp.idRelPersonUpload;
    try {
      const res = await personApi.editItemPerson(tmp);
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
    setPopupUpdatePerson(false);
  };

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      setLoading(true);
      try {
        loadGenderData();
        loadPersonData();
        loadCountry();
        loadRegion();

        const res = await personApi.getItemPerson(id);
        if (res.status == 200) {
          if (res?.data && res?.data?.data) {
            setData(res.data.data);
            if (res.data.data.idCountry != null) {
              setCountrySelected(res.data.data.idCountry);
              onChangeCountry(res.data.data.idCountry);
            }
            if (res.data.data.idRegion != null) setRegionSelected(res.data.data.idRegion);
            if (res.data.data.idRelPersonUpload != null) setRelPersonSelected(res.data.data.idRelPersonUpload);
            setRelGenderSelected(res.data.data.idRelGender);
          }
        } else {
          swal.fire({ text: 'network error', icon: 'error' });
          setPopupUpdatePerson(false);
        }
      } catch (e) {
        console.log(e);
        const errorMessage = get(e, response.data.error);
        swal.fire({ text: errorMessage || 'An occur error', icon: 'error' });
        setLoading(false);
        setPopupUpdatePerson(false);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const getSelectDefault = (options, valueOption) => {
    try {
      const defaultOption = options.filter(function (value) {
        return value.value === valueOption;
      });
      return defaultOption[0];
    } catch {
      return null;
    }
  };

  const loadGenderData = async () => {
    let response = await genderApi.getGenderList({
      orderBy: 'id',
      direction: 'asc',
      perPage: '',
      page: 1,
      searchAll: '',
    });
    if (response.status === 200) {
      const dataGender = response.data.data.map((e) => {
        const tmp = {
          label: e.name,
          value: e.id,
        };
        return tmp;
      });
      setRelGenderSelected(dataGender[0]?.value);
      setRelGenderOptions(dataGender);
    }
  };

  const loadPersonData = async () => {
    let response = await personApi.getPersonList({
      orderBy: 'id',
      direction: 'asc',
      perPage: '',
      page: 1,
      searchAll: '',
    });
    if (response.status === 200) {
      const dataPerson = response.data.data.map((e) => {
        const tmp = {
          label: e.firstName + ' ' + e.middleName + ' ' + e.lastName,
          value: e.id,
        };
        return tmp;
      });
      setRelPersonOptions(dataPerson);
    }
  };

  const loadCountry = async () => {
    let response = await countryApi.getCountryList({
      orderBy: 'id',
      direction: 'asc',
      perPage: '',
      page: 1,
      searchAll: '',
    });
    if (response.status === 200) {
      const dataPCountry = response.data.data.map((e) => {
        const tmp = {
          label: e.country,
          value: e.id,
        };
        return tmp;
      });
      setCountryOptions(dataPCountry);
    }
  };
  const loadRegion = async () => {
    let response = await regionApi.getRegionList({
      orderBy: 'id',
      direction: 'asc',
      perPage: '',
      page: 1,
      searchAll: '',
    });

    if (response.status === 200) {
      const dataRegion = response.data.data.map((e) => {
        const tmp = {
          label: e.region,
          value: e.id,
        };
        return tmp;
      });
      setRegionOptions(dataRegion);
    }
  };

  useEffect(() => {
    onChangeCountry(countrySelected);
  }, [countrySelected]);

  const onChangeCountry = async (idCountry) => {
    let response = await regionApi.getRegionList({
      orderBy: 'id',
      direction: 'asc',
      perPage: '',
      page: 1,
      searchAll: '',
    });

    if (response.status === 200) {
      const regionOfCountry = response.data.data.filter(function (value) {
        return value.idCountry === idCountry;
      });

      const dataRegion = regionOfCountry.map((e) => {
        const tmp = {
          label: e.region,
          value: e.id,
        };
        return tmp;
      });
      setRegionOptions(dataRegion);
    }
  };

  return (
    <Fragment>
      {/* BEGIN Modal */}
      <Modal show={true} size={'xl'}>
        <Modal.Header>{readOnly ? dataLabel.titlePageDetail.name : dataLabel.titlePageUpdate.name}</Modal.Header>
        <Modal.Body>
          {data.id && (
            <form onSubmit={handleSubmit(updatePerson)}>
              <div className="form-group" style={{ height: `600px`, overflow: `scroll`, overflowX: `hidden` }}>
                <label for="lastName" className="form-label">
                  {readOnly ? dataLabel.lastNameDetail.name : dataLabel.lastNameUpdate.name}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  {...register('lastName')}
                  type="text"
                  className="form-control"
                  defaultValue={data.lastName}
                  required
                  readOnly={readOnly}
                />
                {errors.lastName && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.lastName?.message}
                  </div>
                )}
                <label for="middleName" className="form-label">
                  {readOnly ? dataLabel.middleNameDetail.name : dataLabel.middleNameUpdate.name}
                </label>
                <input
                  id="middleName"
                  name="middleName"
                  {...register('middleName')}
                  type="text"
                  className="form-control"
                  defaultValue={data.middleName}
                  required
                  readOnly={readOnly}
                />
                {errors.middleName && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.middleName?.message}
                  </div>
                )}
                <label for="firstName" className="form-label">
                  {readOnly ? dataLabel.firstNameDetail.name : dataLabel.firstNameUpdate.name}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  {...register('firstName')}
                  type="text"
                  defaultValue={data.firstName}
                  className="form-control"
                  required
                  readOnly={readOnly}
                />
                {errors.firstName && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.firstName?.message}
                  </div>
                )}

                <label for="gender" className="form-label">
                  {readOnly ? dataLabel.genderNameDetail.name : dataLabel.genderNameUpdate.name}
                </label>
                <SelectInput
                  value={relGenderOptions.value}
                  options={relGenderOptions}
                  onChange={(e) => {
                    setRelGenderSelected(e.value);
                  }}
                  defaultValue={getSelectDefault(relGenderOptions, data.idRelGender)}
                />

                {submitStatus && relGenderSelected == null && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    Gender is required
                  </div>
                )}

                <p />
                <label for="address" className="form-label">
                  {readOnly ? dataLabel.addressDetail.name : dataLabel.addressUpdate.name}
                </label>
                <input
                  id="address"
                  name="address"
                  {...register('address')}
                  type="text"
                  className="form-control"
                  defaultValue={data.address}
                  required
                  readOnly={readOnly}
                />
                {errors.address && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.address?.message}
                  </div>
                )}

                <label for="zipcode" className="form-label">
                  {readOnly ? dataLabel.zipcodeDetail.name : dataLabel.zipcodeUpdate.name}
                </label>
                <input
                  id="zipcode"
                  name="zipcode"
                  {...register('zipcode')}
                  type="text"
                  className="form-control"
                  defaultValue={data.zipcode}
                  required
                  readOnly={readOnly}
                />
                {errors.zipcode && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.zipcode?.message}
                  </div>
                )}

                <label for="place" className="form-label">
                  {readOnly ? dataLabel.placeDetail.name : dataLabel.placeUpdate.name}
                </label>
                <input
                  id="place"
                  name="place"
                  {...register('place')}
                  type="text"
                  className="form-control"
                  defaultValue={data.place}
                  required
                  readOnly={readOnly}
                />
                {errors.place && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.place?.message}
                  </div>
                )}
                <label for="country" className="form-label">
                  {readOnly ? dataLabel.countryDetail.name : dataLabel.countryUpdate.name}
                </label>
                <SelectInput
                  value={countryOptions.value}
                  options={countryOptions}
                  onChange={(e) => {
                    setCountrySelected(e.value);
                  }}
                  defaultValue={getSelectDefault(countryOptions, data.idCountry)}
                />

                <p />
                <label for="region" className="form-label">
                  {readOnly ? dataLabel.regionDetail.name : dataLabel.regionUpdate.name}
                </label>
                <SelectInput
                  value={regionOptions.value}
                  options={regionOptions}
                  onChange={(e) => {
                    setRegionSelected(e.value);
                  }}
                  defaultValue={getSelectDefault(regionOptions, data.idRegion)}
                />
                <label for="telephone1" className="form-label">
                  {readOnly ? dataLabel.telephone1Detail.name : dataLabel.telephone1Update.name}
                </label>
                <input
                  id="telephone1"
                  name="telephone1"
                  {...register('telephone1')}
                  type="text"
                  defaultValue={data.telephone1}
                  className="form-control"
                  readOnly={readOnly}
                />
                {errors.telephone1 && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.telephone1?.message}
                  </div>
                )}

                <label for="telephone2" className="form-label">
                  {readOnly ? dataLabel.telephone2Detail.name : dataLabel.telephone2Update.name}
                </label>
                <input
                  id="telephone2"
                  name="telephone2"
                  {...register('telephone2')}
                  type="text"
                  defaultValue={data.telephone2}
                  className="form-control"
                  readOnly={readOnly}
                />
                {errors.telephone2 && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.telephone2?.message}
                  </div>
                )}

                <label for="email1" className="form-label">
                  {readOnly ? dataLabel.email1Detail.name : dataLabel.email1Update.name}
                </label>
                <input
                  id="email1"
                  name="email1"
                  {...register('email1')}
                  type="email"
                  className="form-control"
                  defaultValue={data.email1}
                  required
                  readOnly={readOnly}
                />
                {errors.email1 && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.email1?.message}
                  </div>
                )}

                <label for="email2" className="form-label">
                  {readOnly ? dataLabel.email2Detail.name : dataLabel.email2Update.name}
                </label>
                <input
                  id="email2"
                  name="email2"
                  {...register('email2')}
                  type="email"
                  defaultValue={data.email2}
                  className="form-control"
                  required
                  readOnly={readOnly}
                />
                {errors.email2 && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.email2?.message}
                  </div>
                )}
                <label for="memo" className="form-label">
                  {readOnly ? dataLabel.memoDetail.name : dataLabel.memoUpdate.name}
                </label>
                <input
                  id="memo"
                  name="memo"
                  {...register('memo')}
                  type="text"
                  className="form-control"
                  defaultValue={data.memo}
                  required
                  readOnly={readOnly}
                />
                <label for="memoAdministration" className="form-label">
                  {readOnly ? dataLabel.memoAdministrationDetail.name : dataLabel.memoAdministrationUpdate.name}
                </label>
                <input
                  id="memoAdministration"
                  name="memoAdministration"
                  {...register('memoAdministration')}
                  type="text"
                  className="form-control"
                  required
                  readOnly={readOnly}
                />

                <label for="wantsNewsletter" className="form-label">
                  {readOnly ? dataLabel.wantsNewsletterDetail.name : dataLabel.wantsNewsletterUpdate.name}
                </label>
                <input
                  id="wantsNewsletter"
                  name="wantsNewsletter"
                  {...register('wantsNewsletter')}
                  type="number"
                  defaultValue={data.wantsNewsletter}
                  className="form-control"
                  required
                  readOnly={readOnly}
                />
                {errors.wantsNewsletter && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.wantsNewsletter?.message}
                  </div>
                )}

                <label for="person" className="form-label">
                  {readOnly ? dataLabel.idRelPersonUploadDetail.name : dataLabel.idRelPersonUploadUpdate.name}
                </label>
                <SelectInput
                  value={relPersonOptions.value}
                  options={relPersonOptions}
                  onChange={(e) => {
                    setRelPersonSelected(e.value);
                  }}
                  defaultValue={getSelectDefault(relPersonOptions, data.idRelPersonUpload)}
                />
              </div>
              <div className="form-group">
                {isSwitch ? (
                  <Button
                    type="button"
                    variant="outline-danger"
                    className={!readOnly ? 'mr-2' : 'float-right'}
                    onClick={() => setPopupUpdatePerson(false)}
                  >
                    <ChangeLabel label={readOnly ? dataLabel.btnCloseDetail : dataLabel.btnCloseUpdate} />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline-danger"
                    className={!readOnly ? 'mr-2' : 'float-right'}
                    onClick={() => setPopupUpdatePerson(false)}
                  >
                    {readOnly ? dataLabel.btnCloseDetail.name : dataLabel.btnCloseUpdate.name}
                  </Button>
                )}
                {isSwitch
                  ? !readOnly && (
                      <Button
                        type="submit"
                        variant="primary"
                        onClick={handleSubmit(updatePerson)}
                        className="float-right"
                      >
                        <Button
                          onClick={() => {
                            if (submitStatus == false) setSubmitStatus(true);
                          }}
                        >
                          {loading ? (
                            <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />
                          ) : (
                            <ChangeLabel label={readOnly ? dataLabel.btnSaveDetail : dataLabel.btnSaveUpdate} />
                          )}
                        </Button>
                      </Button>
                    )
                  : !readOnly && (
                      <Button
                        type="submit"
                        variant="primary"
                        onClick={handleSubmit(updatePerson)}
                        className="float-right"
                      >
                        <Button
                          onClick={() => {
                            if (submitStatus == false) setSubmitStatus(true);
                          }}
                        >
                          {loading ? (
                            <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />
                          ) : (
                            <ChangeLabel label={readOnly ? dataLabel.btnSaveDetail : dataLabel.btnSaveUpdate} />
                          )}
                        </Button>{' '}
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

export default UpdatePersonModal;
