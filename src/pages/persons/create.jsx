import { useState, useEffect } from 'react';
import { Container, Button, Spinner } from '@blueupcode/components';
import { CircularProgress, Typography } from '@mui/material';

import Head from 'next/head';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/dist/client/router';

import * as yup from 'yup';

import { yupResolver } from 'components/validation/yupResolver';
import { phoneRegExp } from 'components/validation/regExp';
import { swal } from 'components/swal/instance';

import { personApi, genderApi, regionApi, countryApi } from 'services';
import { getPersonList } from 'utils/label';
import styles from 'styles/pages/person-list.module.scss';

import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import SelectInput from '../../components/UI/features/SelectInput';
// Yup schema
const schema = yup.object().shape({
  lastName: yup.string().required(),
  middleName: yup.string().required(),
  firstName: yup.string().required(),
  password: yup.string().required('Password is required').min(6).max(12),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .min(6)
    .max(12)
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  address: yup.string().required(),
  zipcode: yup.string().required(),
  place: yup.string().required(),
  telephone1: yup.string().required().matches(phoneRegExp, 'Phone number is invalid'),
  telephone2: yup.string().required().matches(phoneRegExp, 'Phone number is invalid'),
  email1: yup.string().required().email(),
  email2: yup.string().required().email(),
  wantsNewsletter: yup.number().min(0).typeError('wantNewsletter must be a number'),
  gender: yup.string().required(),
  country: yup.string().required(),
  region: yup.string().required(),
  person: yup.string().required(),
});

function CreatePersonModal() {
  const router = useRouter();

  const [dataLabel, setDataLabel] = useState({});

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const closeTab = () => {
    router.back();
  };

  const resetForm = () => {
    reset();
  };

  // Form
  const formOptions = {
    mode: 'all',
    resolver: yupResolver(schema),
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm(formOptions);

  // Create person
  const createPerson = async (formData) => {
    const requiredOptions = {
      idRelGender: genderSelected?.value ?? null,
      idCountry: countrySelected?.value ?? null,
      idRegion: regionSelected?.value ?? null,
      idRelPersonUpload: personSelected?.value ?? null,
    };

    const isRequiredOptions = Object.entries(requiredOptions).find(([key, value]) => value == null);

    if (isRequiredOptions) return;

    const tmp = {
      lastName: formData.lastName,
      middleName: formData.middleName,
      firstName: formData.firstName,
      idRelGender: genderSelected?.value,
      address: formData.address,
      zipcode: formData.zipcode,
      place: formData.place,
      idCountry: countrySelected?.value,
      idRegion: regionSelected?.value,
      telephone1: formData.telephone1,
      telephone2: formData.telephone2,
      email: formData.email1,
      email1: formData.email1,
      email2: formData.email2,
      confirmPassword: formData.confirmPassword,
      password: formData.password,
      memo: formData.memo,
      memoAdminitration: formData.memoAdminitration,
      wantsNewsletter: formData.wantsNewsletter,
      idRelPersonUpload: personSelected?.value,
    };

    setLoading(true);
    try {
      const res = await personApi.createItemPerson(tmp);
      if (res.status == 200) {
        await swal.fire({ text: res.statusText, icon: 'success' });
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

  // Loading Options
  useEffect(() => {
    loadCountryData();
    loadGenderData();
    loadRegionData();
    loadPersonData();
  }, []);

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
      if (res.data && res.data?.data) {
        const regionData = res.data?.data?.map((item) => ({
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
        <title>{dataLabel.titlePageCreate?.name}</title>
      </Head>
      <Container fluid>
        {pageLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : dataLabel.sort != undefined ? (
          <>
            <form onSubmit={handleSubmit(createPerson)}>
              {/* lastName */}
              <div className="form-group">
                <label className="form-label">{dataLabel.lastNameCreate?.name}</label>
                <input {...register('lastName')} className="form-control" />
                {errors.lastName && (
                  <div style={{ display: 'block' }} className="invalid-feedback">
                    {errors.lastName?.message}
                  </div>
                )}
              </div>
              {/* middleName */}
              <div className="form-group">
                <label htmlFor="middlename" className="form-label">
                  {dataLabel.middleNameCreate?.name}
                </label>
                <input {...register('middleName')} id="middlename" className="form-control" />
                {errors.middleName && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.middleName?.message}
                  </div>
                )}
              </div>
              {/* firstName */}
              <div className="form-group">
                <label htmlFor="firstname" className="form-label">
                  {dataLabel.firstNameCreate?.name}
                </label>
                <input {...register('firstName')} id="firstname" className="form-control" />
                {errors.firstName && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.firstName?.message}
                  </div>
                )}
              </div>
              {/* password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Column password
                </label>
                <input type="password" {...register('password')} id="password" className="form-control" />
                {errors.password && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.password?.message}
                  </div>
                )}
              </div>
              {/* confirmPassword */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Column confirmPassword
                </label>
                <input type="password" {...register('confirmPassword')} id="confirmPassword" className="form-control" />
                {errors.confirmPassword && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.confirmPassword?.message}
                  </div>
                )}
              </div>

              {/* address */}
              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  {dataLabel.addressCreate?.name}
                </label>
                <input {...register('address')} id="address" className="form-control" />
                {errors.address && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.address?.message}
                  </div>
                )}
              </div>
              {/* zipcode */}
              <div className="form-group">
                <label htmlFor="zipcode" className="form-label">
                  {dataLabel.zipcodeCreate?.name}
                </label>
                <input {...register('zipcode')} id="zipcode" className="form-control" />
                {errors.zipcode && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.zipcode?.message}
                  </div>
                )}
              </div>
              {/* place */}
              <div className="form-group">
                <label htmlFor="place" className="form-label">
                  {dataLabel.placeCreate?.name}
                </label>
                <input {...register('place')} id="place" className="form-control" />
                {errors.place && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.place?.message}
                  </div>
                )}
              </div>
              {/* telephone1 */}
              <div className="form-group">
                <label htmlFor="telephone1" className="form-label">
                  {dataLabel.telephone1Create?.name}
                </label>
                <input {...register('telephone1')} id="telephone1" className="form-control" />
                {errors.telephone1 && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.telephone1?.message}
                  </div>
                )}
              </div>
              {/* telephone2 */}
              <div className="form-group">
                <label htmlFor="telephone2" className="form-label">
                  {dataLabel.telephone2Create?.name}
                </label>
                <input {...register('telephone2')} id="telephone2" className="form-control" />
                {errors.telephone2 && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.telephone2?.message}
                  </div>
                )}
              </div>
              {/* email1 */}
              <div className="form-group">
                <label htmlFor="email1" className="form-label">
                  {dataLabel.email1Create?.name}
                </label>
                <input {...register('email1')} id="email1" className="form-control" />
                {errors.email1 && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.email1?.message}
                  </div>
                )}
              </div>
              {/* email2 */}
              <div className="form-group">
                <label htmlFor="email2" className="form-label">
                  {dataLabel.email2Create?.name}
                </label>
                <input {...register('email2')} id="email2" className="form-control" />
                {errors.email2 && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.email2?.message}
                  </div>
                )}
              </div>
              {/* memo */}
              <div className="form-group">
                <label htmlFor="memo" className="form-label">
                  {dataLabel.memoCreate?.name}
                </label>
                <input {...register('memo')} id="memo" className="form-control" />
              </div>
              {/* memoAdminitration */}
              <div className="form-group">
                <label htmlFor="memoAdminitration" className="form-label">
                  {dataLabel.memoAdministrationCreate?.name}
                </label>
                <input {...register('memoAdminitration')} id="memoAdminitration" className="form-control" />
              </div>
              {/* wantsNewsletter */}
              <div className="form-group">
                <label htmlFor="wantsNewsletter" className="form-label">
                  {dataLabel.wantsNewsletterCreate?.name}
                </label>
                <input
                  {...register('wantsNewsletter')}
                  type="number"
                  min={1}
                  max={100}
                  step={1}
                  id="wantsNewsletter"
                  className="form-control"
                />
                {errors.wantsNewsletter && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.wantsNewsletter?.message}
                  </div>
                )}
              </div>
              {/* gender */}
              <div className="form-group">
                <label htmlFor="gender" className="form-label">
                  {dataLabel.genderNameCreate?.name}
                </label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SelectInput id="gender" options={genderOptions} onChange={(e) => { setGenderSelected(e), onChange(e.value) }} />
                  )}
                />
                {errors.gender && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.gender?.message}
                  </div>
                )}
              </div>

              {/* country */}
              <div className="form-group">
                <label htmlFor="country" className="form-label">
                  {dataLabel.countryCreate?.name}
                </label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SelectInput  options={countryOptions} onChange={(e) => {setCountrySelected(e), onChange(e.value)}} />
                    )}
                />
                {errors.country && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.country?.message}
                  </div>
                )}
              </div>
              {/* region */}
              <div className="form-group">
                <label htmlFor="country" className="form-label">
                  {dataLabel.regionCreate?.name}
                </label>
                <Controller
                  name="region"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SelectInput  options={regionOptions} onChange={(e) => {setRegionSelected(e), onChange(e.value)}} />
                    )}
                />
                {errors.region && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.region?.message}
                  </div>
                )}
              </div>
              {/* person */}
              <div className="form-group">
                <label htmlFor="person" className="form-label">
                  {dataLabel.idRelPersonUploadCreate?.name}
                </label>
                <Controller
                  name="person"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SelectInput  options={personOptions} onChange={(e) => {setPersonSelected(e), onChange(e.value)}} />
                    )}
                />
                {errors.person && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.person?.message}
                  </div>
                )}
              </div>
              {/* Group action */}
              <div className="form-group">
                <Button type="button" variant="outline-danger" className="mr-2" onClick={closeTab}>
                  {dataLabel.btnBackCreate?.name || 'Back'}
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
                  {dataLabel.btnCreate?.name}
                </Button>
              </div>
            </form>
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

export default withAuth(withLayout(CreatePersonModal));
