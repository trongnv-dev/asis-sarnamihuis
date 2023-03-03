import { Switch } from '@material-ui/core';
import Tooltip from '@mui/material/Tooltip';
import React, { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleQuickEdit } from 'store/actions';
import ChangeLabel from './ChangeLabel';

const ToggleEditLabel = (props) => {
  const { label } = props;
  const dispatch = useDispatch();
  const isSwitch = useSelector((state) => state.page.isQuickEdit);

  function handleChange() {
    dispatch(handleQuickEdit(!isSwitch));
  }

  useLayoutEffect(() => {
    return () => {
      dispatch(handleQuickEdit(false));
    };
  }, []);

  return (
    <div>
      <Tooltip title={<ChangeLabel label={label} />} placement="top">
        <div>
          <Switch
            size="medium"
            checked={isSwitch}
            onChange={() => {
              handleChange();
            }}
            color="primary"
          />
        </div>
      </Tooltip>
    </div>
  );
};

export default ToggleEditLabel;
