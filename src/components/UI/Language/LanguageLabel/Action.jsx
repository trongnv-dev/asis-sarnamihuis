import { Button } from '@blueupcode/components';
import { faEdit, faEllipsisV, faInfo } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeSvgIcon from 'components/UI/atoms/FontAwesomeSvgIcon';
import MenuPopupState from 'components/UI/features/MenuPopupState';
import React from 'react';
import { useSelector } from 'react-redux';
import { ChangeLabel } from '../../features';
import Tooltip from '@mui/material/Tooltip';

const Action = (props) => {
  const { sort, id, table, handlePopupUpdate, label } = props;
  const isSwitch = useSelector((state) => state.page.isQuickEdit);
  const isUpdate = true;
  const menuList = [
    <Tooltip title={<ChangeLabel label={label.tooltipUpdate} />} placement="right">
      <div>
        <Button
          variant="outline-primary"
          onClick={() => (isSwitch ? null : handlePopupUpdate(id, table, sort, isUpdate))}
        >
          <FontAwesomeSvgIcon icon={faEdit} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipDetail} />} placement="right">
      <div>
        <Button
          variant="outline-success"
          onClick={() => (isSwitch ? null : handlePopupUpdate(id, table, sort, !isUpdate))}
        >
          <FontAwesomeSvgIcon icon={faInfo} />
        </Button>
      </div>
    </Tooltip>,
  ];
  return <MenuPopupState menuList={menuList} icon={faEllipsisV} triggerClose={isSwitch ? false : true} />;
};

export default Action;
