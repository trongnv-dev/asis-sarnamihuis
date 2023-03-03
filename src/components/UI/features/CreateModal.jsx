import { Button } from '@blueupcode/components';
import React from 'react';
import { useSelector } from 'react-redux';
import { ChangeLabel } from 'components/UI/features';

const CreateModal = (props) => {
  const { label, onClick } = props;
  const isSwitch = useSelector((state) => state.page.isQuickEdit);

  return (
    <div style={{ marginLeft: '8px' }}>
      {isSwitch ? (
        <Button>
          <ChangeLabel label={label.btnCreate || {}} />
        </Button>
      ) : (
        <Button onClick={(e) => onClick()}>{label.btnCreate.name}</Button>
      )}
    </div>
  );
};

export default CreateModal;
