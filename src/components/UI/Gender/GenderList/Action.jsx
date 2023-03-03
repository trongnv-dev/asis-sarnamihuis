import { Button } from '@blueupcode/components';
import { faEdit, faEllipsisV, faInfo, faMinus } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeSvgIcon from 'components/UI/atoms/FontAwesomeSvgIcon';
import MenuPopupState from 'components/UI/features/MenuPopupState';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { ChangeLabel } from '../../features';
import { useSelector } from 'react-redux';

const Action = (props) => {
  const { id, handlePopupUpdateGender, handlePopupDeleteGender, label } = props;
  const isUpdate = true;
  const isSwitch = useSelector((state) => state.page.isQuickEdit);
  const menuList = [
    <Tooltip title={<ChangeLabel label={label.tooltipUpdate} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handlePopupUpdateGender(id, isUpdate))}>
          <FontAwesomeSvgIcon icon={faEdit} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipDelete} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handlePopupDeleteGender(id))}>
          <FontAwesomeSvgIcon icon={faMinus} />
        </Button>
        ,
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipDetail} />} placement="right">
      <div>
        <Button variant="outline-success" onClick={() => (isSwitch ? null : handlePopupUpdateGender(id, !isUpdate))}>
          <FontAwesomeSvgIcon icon={faInfo} />
        </Button>
        ,
      </div>
    </Tooltip>,
  ];
  return <MenuPopupState menuList={menuList} icon={faEllipsisV} triggerClose={isSwitch ? false : true} />;
};

export default Action;
