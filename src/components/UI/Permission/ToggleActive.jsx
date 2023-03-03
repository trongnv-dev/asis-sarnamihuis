import { Button, Modal, Spinner } from '@blueupcode/components';
import { Switch } from '@material-ui/core';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { swal } from 'components/swal/instance';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ToggleActive = (props) => {
  const { changePermission, dataPermission, permission } = props;
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleOk = () => {
    setIsOpen(false);
    const changedPermission = dataPermission.find((item) => item.id === permission.id);
    changePermission({ ...changedPermission, isPermission: !changedPermission.isPermission });
  };
  return (
    <>
      <Switch
        id={`language_${permission.id}`}
        size="medium"
        checked={permission.isPermission}
        onChange={() => setIsOpen(true)}
        color="primary"
      />
      <Modal centered isOpen={isOpen}>
        <Modal.Body>
          <DialogContent>Are you sure you want to chage permission ?</DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleOk}>Ok</Button>
          </DialogActions>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ToggleActive;
