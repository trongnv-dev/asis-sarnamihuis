import { swal } from 'components/swal/instance';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import EdiText from 'react-editext';
import { genderApi, languageApi, personApi, countryApi, regionApi, userGroupApi } from 'services';
import { setLabel } from 'store/actions';
import styles from 'styles/pages/ui/features/change-label.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { get } from 'lodash';

const Container = styled.div`
  div {
    margin-left: 0px !important;
  }
`;

const labelType = [
  { code: 'rel_genders.', name: genderApi },
  { code: 'language.', name: languageApi },
  { code: 'rel_persons.', name: personApi },
  { code: 'geo_countries.', name: countryApi },
  { code: 'geo_regions.', name: regionApi },
  { code: 'user_groups.', name: userGroupApi },
];

const ChangeLabel = (props) => {
  const { label } = props;
  const [value, setValue] = useState(label);
  const [openText, setOpenText] = useState(false);

  const languageLabel = useSelector((state) => state.language.label);
  const currentLanguage = useSelector((state) => state.language.currentLanguage);
  const isSwitch = useSelector((state) => state.page.isQuickEdit);

  const dispatch = useDispatch();

  async function fetchApiUpdateLabel(val) {
    try {
      const api = labelType.find((item) => value.code.includes(item.code));
      if (!api) return;
      const params = {
        table: value.table,
        idLabel: value.id,
        sort: value.sort,
        translate: [{ idLanguage: currentLanguage.id, label: val }],
      };
      const response = await api.name.quickEditLabel(params);
      if (response.status == 200) {
        Object.keys(languageLabel).map((key) => {
          if (languageLabel[key].code === value.code) {
            languageLabel[key].name = val;
          }
        });
        dispatch(setLabel({ label: languageLabel }));
        setValue((prev) => {
          return { ...prev, name: val };
        });
        swal.fire({ text: 'Update Sucessful', icon: 'Success' });
      }
    } catch (e) {
      console.log(e);
      const errorMessage = get(e, response.data.error);
      swal.fire({ text: errorMessage || 'An occur error', icon: 'error' });
    }
  }

  const handleSave = (val) => {
    setOpenText(false);
    const newLabel = val.trim();
    if (newLabel) {
      fetchApiUpdateLabel(newLabel);
    } else {
      swal.fire({ text: 'Label cannot empty', icon: 'error' });
    }
  };

  function showEdit(e) {
    setOpenText(true);
    e.preventDefault();
  }

  function hideEdit() {
    setOpenText(false);
  }

  useLayoutEffect(() => {
    setValue(label);
  }, [label]);

  return (
    <>
      {isSwitch ? (
        <Container onContextMenu={(e) => showEdit(e)} onBlur={hideEdit}>
          <EdiText
            editButtonClassName={styles.btnEdit}
            cancelButtonClassName={styles.btnEdit}
            saveButtonClassName={styles.btnEdit}
            type="text"
            value={value?.name}
            editing={openText}
            onSave={handleSave}
            submitOnEnter
            cancelOnEscape
            viewProps={{
              className: styles.text,
            }}
            inputProps={{
              className: styles.input,
            }}
          />
        </Container>
      ) : (
        <Container>{value?.name}</Container>
      )}
    </>
  );
};

export default ChangeLabel;
