import { Switch } from "@material-ui/core";
import React from "react";

const ToggleActive = (props) => {
  const { id, isActive, setPopUpConfirm, setCurrentIdRegion, setCurrentStatusRegion } = props;

  function handlePopupConfirm(id, status) {
    setPopUpConfirm(true);
    setCurrentIdRegion(id);
    setCurrentStatusRegion(status);
  }

  return (
    <Switch
      id={`country_${id}`}
      size="lg"
      checked={isActive}
      onChange={() => handlePopupConfirm(id, !isActive)}
      color="primary"
    />
  );
};

export default ToggleActive;
