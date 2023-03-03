import { Button, Spinner } from '@blueupcode/components';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import React, { Fragment, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { countryApi, genderApi, personApi, regionApi } from 'services';
import * as yup from 'yup';
import SelectInput from '../../features/SelectInput';
import CustomSelectProps from '../../features/SelectCustom';
import { ChangeLabel } from 'components/UI/features';
import { useSelector } from 'react-redux';
import { get } from 'lodash';

const phoneRegExp = /^0[0-9]{9}$|^(?![\s\S])/;

const CreatePersonModal = (props) => {
  const { title, setIsReloadData, isReloadData, setPopupCreatePerson, setPage, setOrderBy, setOrder } = props;
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

  const [relGenderOptions, setRelGenderOptions] = useState([]);
  const [relGenderSelected, setRelGenderSelected] = useState(null);

  const [regionOptions, setRegionOptions] = useState([]);
  const [regionSelected, setRegionSelected] = useState(null);

  const [countryOptions, setCountryOptions] = useState([]);
  const [countrySelected, setCountrySelected] = useState(null);

  const [relPersonOptions, setRelPersonOptions] = useState([]);
  const [relPersonSelected, setRelPersonSelected] = useState(null);

  const [submitStatus, setSubmitStatus] = useState(false);

  const createPerson = async (formData) => {
    setLoading(true);
    if (relGenderSelected == null) {
      setLoading(false);
      return;
    }

    let tmp = {
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
      const res = await personApi.createItemPerson(tmp);
      if (res.status == 200) {
        setPage(1);
        setOrder('desc');
        setOrderBy('id');
        swal.fire({ text: res.data.update, icon: 'success' });
      } else {
        swal.fire({ text: 'network error', icon: 'error' });
      }
    } catch (e) {
      console.log(e);
      const errorMessage = get(e, response.data.error);
      swal.fire({ text: errorMessage || 'An occur error', icon: 'error' });
      setLoading(false);
    }
    setLoading(false);
    setPopupCreatePerson(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        loadGenderData();
        loadPersonData();
        loadCountry();
        loadRegion();
        onChangeCountry(null);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
      setLoading(false);
    };
    loadData();
  }, []);

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
    setRegionSelected(null);
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
          label: e.country,
          value: e.id,
        };
        return tmp;
      });
      setRegionOptions(dataRegion);
    }
  };

  return (
    <Fragment>
      <Modal show={true} size={'xl'}>
        <Modal.Header>
          <Modal.Title>{dataLabel.titlePageCreate.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(createPerson)}>
            <div className="form-group" style={{ height: `600px`, overflow: `scroll`, overflowX: `hidden` }}>
              <label for="lastName" className="form-label">
                {dataLabel.lastNameCreate.name}
              </label>
              <input
                id="lastName"
                name="lastName"
                {...register('lastName')}
                type="text"
                className="form-control"
                required
              />
              {errors.lastName && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.lastName?.message}
                </div>
              )}
              <label for="middleName" className="form-label">
                {dataLabel.middleNameCreate.name}
              </label>
              <input
                id="middleName"
                name="middleName"
                {...register('middleName')}
                type="text"
                className="form-control"
                required
              />
              {errors.middleName && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.middleName?.message}
                </div>
              )}
              <label for="firstName" className="form-label">
                {dataLabel.firstNameCreate.name}
              </label>
              <input
                id="firstName"
                name="firstName"
                {...register('firstName')}
                type="text"
                className="form-control"
                required
              />
              {errors.firstName && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.firstName?.message}
                </div>
              )}

              <label for="gender" className="form-label">
                {dataLabel.genderNameCreate.name}
              </label>

              <CustomSelectProps
                options={relGenderOptions}
                onChange={(e) => {
                  setRelGenderSelected(e.value);
                }}
                onCreate={()=>window.open(`${window.location.origin}/genders/create`, '_blank')}
                onRefresh={()=>loadGenderData()}
                onDetail = {()=>window.open(`${window.location.origin}/genders/${relGenderSelected}`, '_blank')}
              />

              {submitStatus && relGenderSelected == null && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  Gender is required
                </div>
              )}
              <p />
              <label for="address" className="form-label">
                {dataLabel.addressCreate.name}
              </label>
              <input
                id="address"
                name="address"
                {...register('address')}
                type="text"
                className="form-control"
                required
              />
              {errors.address && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.address?.message}
                </div>
              )}

              <label for="zipcode" className="form-label">
                {dataLabel.zipcodeCreate.name}
              </label>
              <input
                id="zipcode"
                name="zipcode"
                {...register('zipcode')}
                type="text"
                className="form-control"
                required
              />
              {errors.zipcode && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.zipcode?.message}
                </div>
              )}

              <label for="place" className="form-label">
                {dataLabel.placeCreate.name}
              </label>
              <input id="place" name="place" {...register('place')} type="text" className="form-control" required />
              {errors.place && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.place?.message}
                </div>
              )}
              <label for="country" className="form-label">
                {dataLabel.countryCreate.name}
              </label>
              <SelectInput
                options={countryOptions}
                onChange={(e) => {
                  setCountrySelected(e.value);
                }}
              />



              <label for="region" className="form-label">
                {dataLabel.regionCreate.name}
              </label>
              <SelectInput
                options={regionOptions}
                onChange={(e) => {
                  setRegionSelected(e.value);
                }}
              />

              <p />
              <label for="telephone1" className="form-label">
                {dataLabel.telephone1Create.name}
              </label>
              <input
                id="telephone1"
                name="telephone1"
                {...register('telephone1')}
                type="text"
                className="form-control"
              />
              {errors.telephone1 && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.telephone1?.message}
                </div>
              )}

              <label for="telephone2" className="form-label">
                {dataLabel.telephone2Create.name}
              </label>
              <input
                id="telephone2"
                name="telephone2"
                {...register('telephone2')}
                type="text"
                className="form-control"
              />
              {errors.telephone2 && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.telephone2?.message}
                </div>
              )}

              <label for="email1" className="form-label">
                {dataLabel.email1Create.name}
              </label>
              <input id="email1" name="email1" {...register('email1')} type="email" className="form-control" required />
              {errors.email1 && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.email1?.message}
                </div>
              )}

              <label for="email2" className="form-label">
                {dataLabel.email2Create.name}
              </label>
              <input id="email2" name="email2" {...register('email2')} type="email" className="form-control" required />
              {errors.email2 && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.email2?.message}
                </div>
              )}
              <label for="memo" className="form-label">
                {dataLabel.memoCreate.name}
              </label>
              <input id="memo" name="memo" {...register('memo')} type="text" className="form-control" required />
              <label for="memoAdministration" className="form-label">
                {dataLabel.memoAdministrationCreate.name}
              </label>
              <input
                id="memoAdministration"
                name="memoAdministration"
                {...register('memoAdministration')}
                type="text"
                className="form-control"
                required
              />

              <label for="wantsNewsletter" className="form-label">
                {dataLabel.wantsNewsletterCreate.name}
              </label>
              <input
                id="wantsNewsletter"
                name="wantsNewsletter"
                {...register('wantsNewsletter')}
                type="number"
                defaultValue={0}
                className="form-control"
                required
              />
              {errors.wantsNewsletter && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.wantsNewsletter?.message}
                </div>
              )}

              <label for="person" className="form-label">
                {dataLabel.idRelPersonUploadCreate.name}
              </label>
              <SelectInput
                options={relPersonOptions}
                onChange={(e) => {
                  setRelPersonSelected(e.value);
                }}
              />

              {errors.person && (
                <div style={{ display: 'block' }} className="invalid-feedback">
                  {errors.person?.message}
                </div>
              )}
            </div>
            <div className="form-group">
              {isSwitch ? (
                <Button
                  type="button"
                  variant="outline-danger"
                  className="mr-2"
                  onClick={() => setPopupCreatePerson(false)}
                >
                  <ChangeLabel label={dataLabel.btnCloseCreate} />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline-danger"
                  className="mr-2"
                  onClick={() => setPopupCreatePerson(false)}
                >
                  {dataLabel.btnCloseCreate.name}
                </Button>
              )}
              {isSwitch ? (
                <Button type="submit" variant="primary" onClick={handleSubmit(createPerson)} className="float-right">
                  <Button
                    onClick={() => {
                      if (submitStatus == false) setSubmitStatus(true);
                    }}
                  >
                    {loading ? (
                      <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />
                    ) : (
                      <ChangeLabel label={dataLabel.btnSaveCreate} />
                    )}
                  </Button>
                </Button>
              ) : (
                <Button type="submit" variant="primary" onClick={handleSubmit(createPerson)} className="float-right">
                  <Button
                    onClick={() => {
                      if (submitStatus == false) setSubmitStatus(true);
                    }}
                  >
                    {loading ? (
                      <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" />
                    ) : (
                      dataLabel.btnSaveCreate.name
                    )}
                  </Button>
                </Button>
              )}
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default CreatePersonModal;
