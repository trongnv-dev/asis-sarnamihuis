import { Button } from '@blueupcode/components';
import { faEdit, faEllipsisV, faInfo, faMinus, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeSvgIcon from 'components/UI/atoms/FontAwesomeSvgIcon';
import MenuPopupState from 'components/UI/features/MenuPopupState';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { ChangeLabel } from '../../features';
import { useSelector } from 'react-redux';

const Action = (props) => {
  const { id, handlePopupUpdatePerson, handlePopupDeletePerson, label, handleShowFileUpload, personName } = props;
  const isSwitch = useSelector((state) => state.page.isQuickEdit);
  const isUpdate = true;
  const menuList = [
    <Tooltip title={<ChangeLabel label={label.tooltipUpdate} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handlePopupUpdatePerson(id, isUpdate))}>
          <FontAwesomeSvgIcon icon={faEdit} />
        </Button>
      </div>
    </Tooltip>,

    <Tooltip title={<ChangeLabel label={label.tooltipDelete} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handlePopupDeletePerson(id, isUpdate))}>
          <FontAwesomeSvgIcon icon={faMinus} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipDetail} />} placement="right">
      <div>
        <Button variant="outline-success" onClick={() => (isSwitch ? null : handlePopupUpdatePerson(id, !isUpdate))}>
          <FontAwesomeSvgIcon icon={faInfo} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipExpand} />} placement="right">
    <div>
      <Button variant="outline-primary" onClick={() => (isSwitch ? null : handleShowFileUpload(id, personName))}>
        <FontAwesomeSvgIcon icon={faArrowCircleDown} />
      </Button>
    </div>
  </Tooltip>
  ];
  return <MenuPopupState menuList={menuList} icon={faEllipsisV} triggerClose={isSwitch ? false : true} />;
};

export default Action;
