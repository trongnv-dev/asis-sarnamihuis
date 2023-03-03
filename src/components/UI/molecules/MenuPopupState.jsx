import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { IconButton } from '@material-ui/core';
import FontAwesomeSvgIcon from '../atoms/FontAwesomeSvgIcon';

const MenuPopupState = ({
	menuList = [],
  icon,
  triggerClose=false
}) => {
  const ITEM_HEIGHT = 48
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <IconButton variant="contained" size="normal" {...bindTrigger(popupState)}>
            <FontAwesomeSvgIcon icon={icon} />
          </IconButton>
          <Menu {...bindMenu(popupState)}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                maxWidth: "23ch",
                display: "table-caption",
                paddingLeft: 10,
                paddingRight: 10,
              }
            }}
          >
            {menuList.map((item) => (
              <MenuItem 
              style={{ marginTop: "2px", padding: "2px"}}
              onClick={() => {
                if (triggerClose) {
                  popupState.close()
                }
              }}>{item}</MenuItem>
            ))}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}

export default MenuPopupState
