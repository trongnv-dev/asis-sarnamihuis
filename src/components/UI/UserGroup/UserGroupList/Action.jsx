import { Button } from '@blueupcode/components';
import { faEdit, faEllipsisV, faInfo, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@mui/material/Tooltip';
import FontAwesomeSvgIcon from 'components/UI/atoms/FontAwesomeSvgIcon';
import MenuPopupState from 'components/UI/features/MenuPopupState';
import React from 'react';
import { useSelector } from 'react-redux';
import { ChangeLabel } from '../../features';

const Action = (props) => {
  const { id, handlePopupUpdateUserGroup, handlePopupDeleteUserGroup, handlePopupAddUserIntoUserGroup, label } = props;
  const isSwitch = useSelector((state) => state.page.isQuickEdit);
  const isUpdate = true;
  const menuList = [
    <Tooltip title={<ChangeLabel label={label.tooltipUpdate} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handlePopupUpdateUserGroup(id, isUpdate))}>
          <FontAwesomeSvgIcon icon={faEdit} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipDelete} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handlePopupDeleteUserGroup(id))}>
          <FontAwesomeSvgIcon icon={faMinus} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipDetail} />} placement="right">
      <div>
        <Button variant="outline-success" onClick={() => (isSwitch ? null : handlePopupUpdateUserGroup(id, !isUpdate))}>
          <FontAwesomeSvgIcon icon={faInfo} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title="Add user into user groups" placement="right">
      <div>
        <Button variant="outline-success" onClick={() => (isSwitch ? null : handlePopupAddUserIntoUserGroup(id))}>
          <FontAwesomeSvgIcon icon={faPlus} />
        </Button>
      </div>
    </Tooltip>,
  ];

  return <MenuPopupState menuList={menuList} icon={faEllipsisV} triggerClose={isSwitch ? false : true} />;
};

export default Action;
