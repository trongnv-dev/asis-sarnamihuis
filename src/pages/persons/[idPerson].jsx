import { useState, useEffect } from 'react';
import { Container, Button } from '@blueupcode/components';
import { CircularProgress, Typography } from '@mui/material';

import Head from 'next/head';
import { useRouter } from 'next/dist/client/router';

import { swal } from 'components/swal/instance';

import { personApi, genderApi, regionApi, countryApi } from 'services';
import { getPersonList } from 'utils/label';
import styles from 'styles/pages/person-list.module.scss';

import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import SelectInput from '../../components/UI/features/SelectInput';

function ViewDetailPersonListModal() {
  const [dataLabel, setDataLabel] = useState({});
  const [data, setData] = useState({});
  const [readOnly, setReadOnly] = useState(true);

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { idPerson } = router.query;

  const closeTab = () => {
    router.back();
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
        <title>{dataLabel.titlePageDetail?.name}</title>
      </Head>
      <Container fluid>
        {pageLoading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : dataLabel.sort != undefined ? (
          <>
            {data.id && (
              <form>
                {/* lastName */}
                <div className="form-group">
                  <label className="form-label">{dataLabel.lastNameDetail?.name}</label>
                  <input className="form-control" defaultValue={data.lastName} readOnly={readOnly} />
                </div>
                {/* middleName */}
                <div className="form-group">
                  <label htmlFor="middlename" className="form-label">
                    {dataLabel.middleNameDetail?.name}
                  </label>
                  <input id="middlename" className="form-control" defaultValue={data.middleName} readOnly={readOnly} />
                </div>
                {/* firstName */}
                <div className="form-group">
                  <label htmlFor="firstname" className="form-label">
                    {dataLabel.firstNameDetail?.name}
                  </label>
                  <input id="firstname" className="form-control" defaultValue={data.firstName} readOnly={readOnly} />
                </div>
                {/* address */}
                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    {dataLabel.addressDetail?.name}
                  </label>
                  <input id="address" className="form-control" defaultValue={data.address} readOnly={readOnly} />
                </div>
                {/* zipcode */}
                <div className="form-group">
                  <label htmlFor="zipcode" className="form-label">
                    {dataLabel.zipcodeDetail?.name}
                  </label>
                  <input id="zipcode" className="form-control" defaultValue={data.zipcode} readOnly={readOnly} />
                </div>
                {/* place */}
                <div className="form-group">
                  <label htmlFor="place" className="form-label">
                    {dataLabel.placeDetail?.name}
                  </label>
                  <input id="place" className="form-control" defaultValue={data.place} readOnly={readOnly} />
                </div>
                {/* telephone1 */}
                <div className="form-group">
                  <label htmlFor="telephone1" className="form-label">
                    {dataLabel.telephone1Detail?.name}
                  </label>
                  <input id="telephone1" className="form-control" defaultValue={data.telephone1} readOnly={readOnly} />
                </div>
                {/* telephone2 */}
                <div className="form-group">
                  <label htmlFor="telephone2" className="form-label">
                    {dataLabel.telephone2Detail?.name}
                  </label>
                  <input id="telephone2" className="form-control" defaultValue={data.telephone2} readOnly={readOnly} />
                </div>
                {/* email1 */}
                <div className="form-group">
                  <label htmlFor="email1" className="form-label">
                    {dataLabel.email1Detail?.name}
                  </label>
                  <input id="email1" className="form-control" defaultValue={data.email1} readOnly={readOnly} />
                </div>
                {/* email2 */}
                <div className="form-group">
                  <label htmlFor="email2" className="form-label">
                    {dataLabel.email2Detail?.name}
                  </label>
                  <input id="email2" className="form-control" defaultValue={data.email2} readOnly={readOnly} />
                </div>
                {/* memo */}
                <div className="form-group">
                  <label htmlFor="memo" className="form-label">
                    {dataLabel.memoDetail?.name}
                  </label>
                  <input id="memo" className="form-control" defaultValue={data.memo} readOnly={readOnly} />
                </div>
                {/* memoAdminitration */}
                <div className="form-group">
                  <label htmlFor="memoAdminitration" className="form-label">
                    {dataLabel.memoAdministrationDetail?.name}
                  </label>
                  <input
                    id="memoAdminitration"
                    className="form-control"
                    defaultValue={data.memoAdministration}
                    readOnly={readOnly}
                  />
                </div>
                {/* wantsNewsletter */}
                <div className="form-group">
                  <label htmlFor="wantsNewsletter" className="form-label">
                    {dataLabel.wantsNewsletterDetail?.name}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    step={1}
                    id="wantsNewsletter"
                    className="form-control"
                    defaultValue={data.wantsNewsletter}
                    readOnly={readOnly}
                  />
                </div>
                {/* gender */}
                <div className="form-group">
                  <label htmlFor="gender" className="form-label">
                    {dataLabel.genderNameDetail?.name}
                  </label>
                  <SelectInput
                    options={genderOptions}
                    defaultValue={getSelectDefault(genderOptions, data.idRelGender)}
                    isDisabled={readOnly}
                  />
                </div>
                {/* country */}
                <div className="form-group">
                  <label htmlFor="country" className="form-label">
                    {dataLabel.countryDetail?.name}
                  </label>
                  <SelectInput
                    options={countryOptions}
                    defaultValue={getSelectDefault(countryOptions, data.idCountry)}
                    isDisabled={readOnly}
                  />
                </div>
                {/* region */}
                <div className="form-group">
                  <label htmlFor="country" className="form-label">
                    {dataLabel.regionDetail?.name}
                  </label>
                  <SelectInput
                    options={regionOptions}
                    defaultValue={getSelectDefault(regionOptions, data.idRegion)}
                    isDisabled={readOnly}
                  />
                </div>
                {/* person */}
                <div className="form-group">
                  <label htmlFor="person" className="form-label">
                    {dataLabel.idRelPersonUploadDetail?.name}
                  </label>
                  <SelectInput
                    options={personOptions}
                    defaultValue={getSelectDefault(personOptions, data.idRelPersonUpload)}
                    isDisabled={readOnly}
                  />
                </div>
                {/* Group action */}
                <div className="form-group">
                  <Button type="button" variant="outline-danger" className="mr-2" onClick={closeTab}>
                    {dataLabel.btnBackDetail?.name || 'Back'}
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

export default withAuth(withLayout(ViewDetailPersonListModal));
