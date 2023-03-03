import { Switch } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import React from 'react';
import { useSelector } from 'react-redux';

const ToggleActive = (props) => {
  const { id, isActive, setPopUpConfirm, setCurrentIdLanguage, setCurrentStatusLanguage } = props;
  const currentLanguage = useSelector((state) => state.language.currentLanguage);

  function handlePopupConfirm(id, status) {
    if (id === currentLanguage.id) {
      swal.fire({ text: 'currently selected language cannot be deactivated', icon: 'error' });
    } else {
      setPopUpConfirm(true);
      setCurrentIdLanguage(id);
      setCurrentStatusLanguage(status);
    }
  }

  return (
    <Switch
      id={`language_${id}`}
      size="medium"
      checked={isActive}
      onChange={() => handlePopupConfirm(id, !isActive)}
      color="primary"
    />
  );
};

export default ToggleActive;
