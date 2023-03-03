import { useState, useEffect } from 'react';
import { Container, Button, Spinner } from '@blueupcode/components';
import { CircularProgress, Typography } from '@mui/material';

import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/dist/client/router';

import * as yup from 'yup';

import { yupResolver } from 'components/validation/yupResolver';
import { phoneRegExp } from 'components/validation/regExp';
import { swal } from 'components/swal/instance';

import { personApi, genderApi, regionApi, countryApi } from 'services';
import { getPersonList } from 'utils/label';
import styles from 'styles/pages/person-list.module.scss';
import SelectInput from '../../../components/UI/features/SelectInput';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';

// Yup schema
const schema = yup.object().shape({
  lastName: yup.string().required(),
  middleName: yup.string().required(),
  firstName: yup.string().required(),
  address: yup.string().required(),
  zipcode: yup.string().required(),
  place: yup.string().required(),
  telephone1: yup.string().required().matches(phoneRegExp, 'Phone number is invalid'),
  telephone2: yup.string().required().matches(phoneRegExp, 'Phone number is invalid'),
  email1: yup.string().email(),
  email2: yup.string().email(),
  wantsNewsletter: yup.number().typeError('wantNewsletter must be a number'),
});

function UpdatePersonListModal() {
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { idPerson } = router.query;

  const closeTab = () => {
    router.back();
  };

  // Form
  const formOptions = {
    mode: 'all',
    resolver: yupResolver(schema),
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  // Update person
  const updatePerson = async (formData) => {
    setLoading(true);
    const tmp = {
      id: data.id,
      lastName: formData.lastName,
      middleName: formData.middleName,
      firstName: formData.firstName,
      idRelGender: genderSelected?.value || data.idRelGender,
      address: formData.address,
      zipcode: formData.zipcode,
      place: formData.place,
      idCountry: countrySelected?.value || data.idCountry,
      idRegion: regionSelected?.value || data.idRegion,
      telephone1: formData.telephone1,
      telephone2: formData.telephone2,
      email1: formData.email1,
      email2: formData.email2,
      memo: formData.memo,
      memoAdminitration: formData.memoAdminitration,
      wantsNewsletter: formData.wantsNewsletter,
      idRelPersonUpload: personSelected?.value || data.idRelPersonUpload,
    };
    try {
      const res = await personApi.editItemPerson(tmp);
      if (res.status === 200) {
        swal.fire({ text: res.statusText, icon: 'success' });
        closeTab();
      } else {
        swal.fire({ text: res.statusText, icon: 'error' });
      }
    } catch (e) {
      console.log(e);
      swal.fire({ text: e, icon: 'error' });
      setLoading(false);
    }
    setLoading(false);
  };

  // API - getPersonLabel
  useEffect(() => {
    const fetchPersonLabel = async () => {
      try {
        const res = await personApi.getPersonLabel();
        if (res.data && res.data?.data) {
          const personlabel = getPersonList(res.data.data);
          setDataLabel(personlabel);
        } else {
          swal.fire({ text: res.statusText, icon: 'error' });
        }
      } catch (e) {
        console.log(e);
        swal.fire({ text: e, icon: 'error' });
        setPageLoading(false);
      }
      setPageLoading(false);
    };
    fetchPersonLabel();
  }, []);

  // API - getItemPerson
  useEffect(() => {
    if (!idPerson) return;
    setLoading(true);
    const fetchPerson = async () => {
      try {
        loadGenderData();
        loadCountryData();
        loadPersonData();
        loadRegionData();

        const res = await personApi.getItemPerson(idPerson);
        if (res.data && res.data?.data) {
          const person = res.data.data;
          setData(person);
        } else {
          swal.fire({ text: res.statusText, icon: 'error' });
        }
      } catch (e) {
        console.log(e);
        swal.fire({ text: e, icon: 'error' });
        setLoading(false);
      }
      setLoading(false);
    };
    fetchPerson();
  }, []);

  // Get selected default
  const getSelectDefault = (options, valueOption) => {
    const defaultOption = options.find((item) => item.value == valueOption);
    return defaultOption ?? null;
  };

  // Gender
  const [genderSelected, setGenderSelected] = useState(null);
  const [genderOptions, setGenderOptions] = useState([]);

  // Gender - Load gender options
  const loadGenderData = async () => {
    try {
      const res = await genderApi.getGenderList({
        orderBy: 'id',
        direction: 'asc',
        parPage: '',
        page: 1,
        searchAll: '',
      });
      if (res.data && res.data?.data) {
        const genderData = res.data.data.map((item) => ({ label: item.name, value: item.id }));
        setGenderOptions(genderData);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Contry
  const [countrySelected, setCountrySelected] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);

  // Country - Load country options
  const loadCountryData = async () => {
    try {
      const res = await countryApi.getCountryList({
        orderBy: 'id',
        direction: 'asc',
        perPage: '',
        page: 1,
        searchAll: '',
      });
      if (res.data && res.data?.data) {
        const countryData = res.data.data.map((item) => ({
          label: item.country,
          value: item.id,
        }));
        setCountryOptions(countryData);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Person
  const [personSelected, setPersonSelected] = useState(null);
  const [personOptions, setPersonOptions] = useState([]);

  // Person - Load person options
  const loadPersonData = async () => {
    try {
      const res = await personApi.getPersonList({
        orderBy: 'id',
        direction: 'asc',
        perPage: '',
        page: 1,
        searchAll: '',
      });
      if (res.data && res.data?.data) {
        const personData = res.data.data.map((item) => ({
          label: `${item.firstName} ${item.middleName} ${item.lastName}`,
          value: item.id,
        }));

        setPersonOptions(personData);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Region
  const [regionSelected, setRegionSelected] = useState(null);
  const [regionOptions, setRegionOptions] = useState([]);

  // Region - Load region options
  const loadRegionData = async () => {
    try {
      const res = await regionApi.getRegionList({
        orderBy: 'id',
        direction: 'asc',
        perPage: '',
        page: 1,
        searchAll: '',
      });
      if (res.data && res.data.data) {
        const regionData = res.data.data.map((item) => ({
          label: item.region,
          value: item.id,
        }));
        setRegionOptions(regionData);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Head>
        <title>{dataLabel.titlePageUpdate?.name}</title>
      </Head>
      <Container fluid>
        {pageLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : dataLabel.sort != undefined ? (
          <>
            {data.id && (
              <form onSubmit={handleSubmit(updatePerson)}>
                {/* lastName */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.lastNameUpdate?.name}</label>
                  <input {...register('lastName')} className="form-control" defaultValue={data.lastName} />
                  {errors.lastName && (
                    <div style={{ display: 'block' }} className="invalid-feedback">
                      {errors.lastName?.message}
                    </div>
                  )}
                </div>
                {/* middleName */}
                <div className="form-group">
                  <label htmlFor="middlename" className="form-label">
                    {dataLabel.middleNameUpdate?.name}
                  </label>
                  <input
                    {...register('middleName')}
                    id="middlename"
                    className="form-control"
                    defaultValue={data.middleName}
                  />
                  {errors.middleName && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.middleName?.message}
                    </div>
                  )}
                </div>
                {/* firstName */}
                <div className="form-group">
                  <label htmlFor="firstname" className="form-label">
                    {dataLabel.firstNameUpdate?.name}
                  </label>
                  <input
                    {...register('firstName')}
                    id="firstname"
                    className="form-control"
                    defaultValue={data.firstName}
                  />
                  {errors.firstName && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.firstName?.message}
                    </div>
                  )}
                </div>
                {/* address */}
                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    {dataLabel.addressUpdate?.name}
                  </label>
                  <input {...register('address')} id="address" className="form-control" defaultValue={data.address} />
                  {errors.address && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.address?.message}
                    </div>
                  )}
                </div>
                {/* zipcode */}
                <div className="form-group">
                  <label htmlFor="zipcode" className="form-label">
                    {dataLabel.zipcodeUpdate?.name}
                  </label>
                  <input {...register('zipcode')} id="zipcode" className="form-control" defaultValue={data.zipcode} />
                  {errors.zipcode && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.zipcode?.message}
                    </div>
                  )}
                </div>
                {/* place */}
                <div className="form-group">
                  <label htmlFor="place" className="form-label">
                    {dataLabel.placeUpdate?.name}
                  </label>
                  <input {...register('place')} id="place" className="form-control" defaultValue={data.place} />
                  {errors.place && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.place?.message}
                    </div>
                  )}
                </div>
                {/* telephone1 */}
                <div className="form-group">
                  <label htmlFor="telephone1" className="form-label">
                    {dataLabel.telephone1Update?.name}
                  </label>
                  <input
                    {...register('telephone1')}
                    id="telephone1"
                    className="form-control"
                    defaultValue={data.telephone1}
                  />
                  {errors.telephone1 && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.telephone1?.message}
                    </div>
                  )}
                </div>
                {/* telephone2 */}
                <div className="form-group">
                  <label htmlFor="telephone2" className="form-label">
                    {dataLabel.telephone2Update?.name}
                  </label>
                  <input
                    {...register('telephone2')}
                    id="telephone2"
                    className="form-control"
                    defaultValue={data.telephone2}
                  />
                  {errors.telephone2 && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.telephone2?.message}
                    </div>
                  )}
                </div>
                {/* email1 */}
                <div className="form-group">
                  <label htmlFor="email1" className="form-label">
                    {dataLabel.email1Update?.name}
                  </label>
                  <input {...register('email1')} id="email1" className="form-control" defaultValue={data.email1} />
                  {errors.email1 && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.email1?.message}
                    </div>
                  )}
                </div>
                {/* email2 */}
                <div className="form-group">
                  <label htmlFor="email2" className="form-label">
                    {dataLabel.email2Update?.name}
                  </label>
                  <input {...register('email2')} id="email2" className="form-control" defaultValue={data.email2} />
                  {errors.email2 && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {errors.email2?.message}
                    </div>
                  )}
                </div>
                {/* memo */}
                <div className="form-group">
                  <label htmlFor="memo" className="form-label">
                    {dataLabel.memoUpdate?.name}
                  </label>
                  <input {...register('memo')} id="memo" className="form-control" defaultValue={data.memo} />
                </div>
                {/* memoAdminitration */}
                <div className="form-group">
                  <label htmlFor="memoAdminitration" className="form-label">
                    {dataLabel.memoAdministrationUpdate?.name}
                  </label>
                  <input
                    {...register('memoAdminitration')}
                    id="memoAdminitration"
                    className="form-control"
                    defaultValue={data.memoAdministration}
                  />
                </div>
                {/* wantsNewsletter */}
                <div className="form-group">
                  <label htmlFor="wantsNewsletter" className="form-label">
                    {dataLabel.wantsNewsletterUpdate?.name}
                  </label>
                  <input
                    {...register('wantsNewsletter')}
                    type="number"
                    min={1}
                    max={100}
                    step={1}
                    id="wantsNewsletter"
                    className="form-control"
                    defaultValue={data.wantsNewsletter}
                  />
                </div>
                {/* gender */}
                <div className="form-group">
                  <label htmlFor="gender" className="form-label">
                    {dataLabel.genderNameUpdate?.name}
                  </label>
                  <SelectInput
                    options={genderOptions}
                    onChange={(e) => setGenderSelected(e)}
                    defaultValue={getSelectDefault(genderOptions, data.idRelGender)}
                  />
                </div>
                {/* country */}
                <div className="form-group">
                  <label htmlFor="country" className="form-label">
                    {dataLabel.countryUpdate?.name}
                  </label>
                  <SelectInput
                    options={countryOptions}
                    onChange={(e) => setCountrySelected(e)}
                    defaultValue={getSelectDefault(countryOptions, data.idCountry)}
                  />
                </div>
                {/* region */}
                <div className="form-group">
                  <label htmlFor="country" className="form-label">
                    {dataLabel.regionUpdate?.name}
                  </label>
                  <SelectInput
                    options={regionOptions}
                    onChange={(e) => setRegionSelected(e)}
                    defaultValue={getSelectDefault(regionOptions, data.idRegion)}
                  />
                </div>
                {/* person */}
                <div className="form-group">
                  <label htmlFor="person" className="form-label">
                    {dataLabel.idRelPersonUploadUpdate?.name}
                  </label>
                  <SelectInput
                    options={personOptions}
                    onChange={(e) => setPersonSelected(e)}
                    defaultValue={getSelectDefault(personOptions, data.idRelPersonUpload)}
                  />
                </div>
                {/* Group action */}
                <div className="form-group">
                  <Button type="button" variant="outline-danger" className="mr-2" onClick={closeTab}>
                    {dataLabel.btnBackUpdate?.name || 'Back'}
                  </Button>
                  <Button type="submit" variant="primary">
                    {loading && (
                      <Spinner
                        style={{
                          width: '1.5rem',
                          height: '1.5rem',
                        }}
                        className="mr-2"
                      />
                    )}
                    {dataLabel.btnSaveUpdate?.name}
                  </Button>
                </div>
              </form>
            )}
          </>
        ) : (
          <Typography align="center" className={styles.noData}>
            There are no labels to display
          </Typography>
        )}
      </Container>
    </>
  );
}

export default withAuth(withLayout(UpdatePersonListModal));
