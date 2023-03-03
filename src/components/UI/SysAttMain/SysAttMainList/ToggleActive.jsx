import { Switch } from "@material-ui/core";
import React from "react";

const ToggleActive = (props) => {
  const { id, isActive, setPopUpConfirm, setCurrentIdSysAttMain, setCurrentStatusSysAttMain } = props;

  function handlePopupConfirm(id, status) {
    setPopUpConfirm(true);
    setCurrentIdSysAttMain(id);
    setCurrentStatusSysAttMain(status);
  }

  return (
    <Switch
      id={`gender_${id}`}
      size="lg"
      checked={isActive}
      onChange={() => handlePopupConfirm(id, !isActive)}
      color="primary"
    />
  );
};

export default ToggleActive;
