import { IconButton } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import * as React from 'react';
import FontAwesomeSvgIcon from '../atoms/FontAwesomeSvgIcon';
import styled from 'styled-components';
import { Button } from '@blueupcode/components';

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const MenuPopupState = ({
  menuList = [],
  icon,
  triggerClose = false,
  tooltip,
  typeFilter,
  setTypeFilter,
  handleSearchAndFilter,
  clearFilter,
}) => {
  const ITEM_HEIGHT = 48;
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Tooltip title={tooltip ? tooltip : ''} placement="top">
            <IconButton variant="contained" size="medium" {...bindTrigger(popupState)}>
              <FontAwesomeSvgIcon icon={icon} />
            </IconButton>
          </Tooltip>
          <Menu
            {...bindMenu(popupState)}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                maxWidth: '23ch',
                display: 'table-caption',
                paddingLeft: 10,
                paddingRight: 10,
              },
            }}
          >
            {menuList.map((item, index) => (
              <MenuItem
                style={{ marginTop: '2px', padding: '2px', display: 'block', width: '100%' }}
                onClick={() => {
                  if (triggerClose) {
                    popupState.close();
                  }
                }}
                key={`popup-state-${index}-${item}`}
              >
                {item}
              </MenuItem>
            ))}
            {typeFilter && (
              <>
                <div
                  style={{ marginTop: '2px', display: 'block', width: '100%' }}
                  className="d-flex justify-content-start align-items-center"
                >
                  Or:
                  <Checkbox
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    style={{ color: '#2196F3' }}
                    checked={typeFilter === 'or'}
                    onClick={() => setTypeFilter('or')}
                  />
                  And:
                  <Checkbox
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    style={{ color: '#2196F3' }}
                    checked={typeFilter === 'and'}
                    onClick={() => setTypeFilter('and')}
                  />
                </div>

                <div
                  style={{ marginTop: '2px', padding: '2px', display: 'block', width: '100%' }}
                  className="d-flex justify-content-start align-items-center"
                >
                  <Button
                    onClick={() => {
                      popupState.close();
                      handleSearchAndFilter();
                    }}
                  >
                    Apply
                  </Button>
                  <Button
                    type="button"
                    variant="outline-danger"
                    onClick={() => {
                      popupState.close();
                      handleSearchAndFilter('clear');
                    }}
                    style={{ marginLeft: '5px' }}
                  >
                    Clear
                  </Button>
                </div>
              </>
            )}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
};

export default MenuPopupState;
