import { Button } from '@blueupcode/components';
import { faArrowCircleDown, faEdit, faEllipsisV, faInfo, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeSvgIcon from 'components/UI/atoms/FontAwesomeSvgIcon';
import MenuPopupState from 'components/UI/features/MenuPopupState';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { useSelector } from 'react-redux';
import { ChangeLabel } from '../../features';

const Action = (props) => {
  const {
    name,
    parentId,
    id,
    handlePopupUpdateRegion,
    handlePopupDeleteRegion,
    handlePopupCreateRegion,
    handleShowChildRegion,
    label,
    isShowChild
  } = props;
  const isSwitch = useSelector((state) => state.page.isQuickEdit);
  const isUpdate = true;

  const menuList = isShowChild?[
    <Tooltip title={<ChangeLabel label={label.tooltipUpdate} />} placement="right">
      <div>
        <Button
          variant="outline-primary"
          onClick={() => (isSwitch ? null : handlePopupUpdateRegion(id, parentId, isUpdate))}
        >
          <FontAwesomeSvgIcon icon={faEdit} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipCreate} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handlePopupCreateRegion(id))}>
          <FontAwesomeSvgIcon icon={faPlus} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipDelete} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handlePopupDeleteRegion(id))}>
          <FontAwesomeSvgIcon icon={faMinus} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipChildren} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handleShowChildRegion(id, name))}>
          <FontAwesomeSvgIcon icon={faArrowCircleDown} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipDetail} />} placement="right">
      <div>
        <Button
          variant="outline-success"
          onClick={() => (isSwitch ? null : handlePopupUpdateRegion(id, parentId, !isUpdate))}
        >
          <FontAwesomeSvgIcon icon={faInfo} />
        </Button>
      </div>
    </Tooltip>,
  ]:[
    <Tooltip title={<ChangeLabel label={label.tooltipUpdate} />} placement="right">
      <div>
        <Button
          variant="outline-primary"
          onClick={() => (isSwitch ? null : handlePopupUpdateRegion(id, parentId, isUpdate))}
        >
          <FontAwesomeSvgIcon icon={faEdit} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipCreate} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handlePopupCreateRegion(id))}>
          <FontAwesomeSvgIcon icon={faPlus} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipDelete} />} placement="right">
      <div>
        <Button variant="outline-primary" onClick={() => (isSwitch ? null : handlePopupDeleteRegion(id))}>
          <FontAwesomeSvgIcon icon={faMinus} />
        </Button>
      </div>
    </Tooltip>,
    <Tooltip title={<ChangeLabel label={label.tooltipDetail} />} placement="right">
      <div>
        <Button
          variant="outline-success"
          onClick={() => (isSwitch ? null : handlePopupUpdateRegion(id, parentId, !isUpdate))}
        >
          <FontAwesomeSvgIcon icon={faInfo} />
        </Button>
      </div>
    </Tooltip>,
  ];

  return <MenuPopupState menuList={menuList} icon={faEllipsisV} triggerClose={isSwitch ? false : true} />;
};

export default Action;