import { Button } from '@blueupcode/components';
import { faArrowCircleDown, faEdit, faEllipsisV, faInfo, faMinus } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeSvgIcon from 'components/UI/atoms/FontAwesomeSvgIcon';
import MenuPopupState from 'components/UI/features/MenuPopupState';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { ChangeLabel } from '../../features';
import { useSelector } from 'react-redux';

const Action = (props) => {
  const { id, handlePopupUpdatePersonUpload, handlePopupDeletePersonUpload, label, personName, handleShowFileUpload, showExtendOnly = false } = props;
  const isSwitch = useSelector((state) => state.page.isQuickEdit);
  const isUpdate = true;
  const menuList = showExtendOnly?[
    <Tooltip title={<ChangeLabel label={label.tooltipExpand} />} placement="right">
    <div>
      <Button variant="outline-primary" onClick={() => (isSwitch ? null : handleShowFileUpload(id, personName))}>
        <FontAwesomeSvgIcon icon={faArrowCircleDown} />
      </Button>
    </div>
  </Tooltip>,
  ]: [
    <Tooltip title={<ChangeLabel label={label.tooltipUpdate} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handlePopupUpdatePersonUpload(id, isUpdate))}>
          <FontAwesomeSvgIcon icon={faEdit} />
        </Button>
      </div>
    </Tooltip>,

    <Tooltip title={<ChangeLabel label={label.tooltipDelete} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handlePopupDeletePersonUpload(id, isUpdate))}>
          <FontAwesomeSvgIcon icon={faMinus} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipDetail} />} placement="right">
      <div>
        <Button variant="outline-success" onClick={() => (isSwitch ? null : handlePopupUpdatePersonUpload(id, !isUpdate))}>
          <FontAwesomeSvgIcon icon={faInfo} />
        </Button>
      </div>
    </Tooltip>,
  ];
  return <MenuPopupState menuList={menuList} icon={faEllipsisV} triggerClose={isSwitch ? false : true} />;
};

export default Action;
