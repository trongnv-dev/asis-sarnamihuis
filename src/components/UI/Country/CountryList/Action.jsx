import { Button } from '@blueupcode/components';
import { faArrowCircleDown, faEdit, faEllipsisV, faInfo, faMinus } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@mui/material/Tooltip';
import FontAwesomeSvgIcon from 'components/UI/atoms/FontAwesomeSvgIcon';
import MenuPopupState from 'components/UI/features/MenuPopupState';
import React from 'react';
import { useSelector } from 'react-redux';
import { ChangeLabel } from '../../features';

const Action = (props) => {
  const { id, handlePopupUpdateCountry, handlePopupDeleteCountry, handleShowlistRegion, countryName, label } = props;
  const isUpdate = true;
  const isSwitch = useSelector((state) => state.page.isQuickEdit);
  const menuList = [
    <Tooltip title={<ChangeLabel label={label.tooltipUpdate} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handlePopupUpdateCountry(id, isUpdate))}>
          <FontAwesomeSvgIcon icon={faEdit} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipDelete} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handlePopupDeleteCountry(id))}>
          <FontAwesomeSvgIcon icon={faMinus} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipChildren} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handleShowlistRegion(id, countryName))}>
          <FontAwesomeSvgIcon icon={faArrowCircleDown} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipDetail} />} placement="right">
      <div>
        <Button variant="outline-success" onClick={() => (isSwitch ? null : handlePopupUpdateCountry(id, !isUpdate))}>
          <FontAwesomeSvgIcon icon={faInfo} />
        </Button>
      </div>
    </Tooltip>,
  ];
  return <MenuPopupState menuList={menuList} icon={faEllipsisV} triggerClose={isSwitch ? false : true} />;
};

export default Action;
