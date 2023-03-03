import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import React from 'react';
import { commonApi } from 'services';
import MenuPopupState from './MenuPopupState';
import ChangeLabel from './ChangeLabel';

function ToggleVisibilityColTable(props) {
  const { columns, setColumns, languageLabel, codeTable, userConfig, disable, label } = props;
  if (!(columns && columns.length > 0)) return <div></div>;

  const handleShowHideColumns = (key) => {
    const editColumns = [...columns];
    editColumns.map((item) => {
      if (item.key === key) {
        item.visibility = !item.visibility;
      }
    });

    async function fetchApi() {
      const config = {};
      editColumns.map((item) => {
        config[item.code] = item.visibility;
      });
      try {
        userConfig.column_config = config;
        await commonApi.colTableConfig({
          code: codeTable,
          value: userConfig,
        });
      } catch (e) {
        console.log(e);
        swal.fire({ text: e.message, icon: 'error' });
      }
    }
    fetchApi();
    setColumns(editColumns);
  };

  const itemsList = [];
  columns.map((data) => {
    itemsList.push(
      <FormControlLabel
        className="w-100"
        control={<Checkbox onChange={() => handleShowHideColumns(data.key)} checked={data.visibility} />}
        label={languageLabel[data.label]?.name || 'NULL'}
      />
    );
  });

  return (
    <div style={{ marginLeft: '8', pointerEvents: `${disable === true ? 'none' : ''}` }}>
      <MenuPopupState menuList={itemsList} icon={faAlignJustify} tooltip={<ChangeLabel label={label} />} />
    </div>
  );
}

export default ToggleVisibilityColTable;
