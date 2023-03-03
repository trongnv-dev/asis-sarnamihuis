import { Dropdown } from '@blueupcode/components';
import { ChangeLabel } from 'components/UI/features';
import { downloadCSV, downloadExcel, downloadPDF } from 'lib/common/exportFile';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from 'styles/pages/export/export.module.scss';

const SecondSubMenu = (props) => {
  const { handleExportFile, button, label } = props;
  const isSwitch = useSelector((state) => state.page.isQuickEdit);

  return (
    <>
      <Dropdown.SubmenuMenu>
        {isSwitch ? (
          <>
            <div className={styles.textDropdown}>
              <ChangeLabel label={label.btnExportAllData} />
            </div>
            <div className={styles.textDropdown}>
              <ChangeLabel label={label.btnExportSearchData} />
            </div>
            <div className={styles.textDropdown}>
              <ChangeLabel label={label.btnExportCurrentPage} />
            </div>
          </>
        ) : (
          <>
            <Dropdown.Item
              onClick={() => {
                handleExportFile(button, 'all');
              }}
            >
              {label.btnExportAllData.name}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                handleExportFile(button, 'filter');
              }}
            >
              {label.btnExportSearchData.name}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                handleExportFile(button, 'page');
              }}
            >
              {label.btnExportCurrentPage.name}
            </Dropdown.Item>
          </>
        )}
      </Dropdown.SubmenuMenu>
    </>
  );
};

const FristSubMenu = (props) => {
  const { label, button, handleExportFile } = props;
  const isSwitch = useSelector((state) => state.page.isQuickEdit);

  return (
    <Dropdown.Submenu>
      {isSwitch ? (
        <div className={styles.textDropdown}>
          <ChangeLabel label={label[button]} />
        </div>
      ) : (
        <Dropdown.Item tag="button">{label[button].name}</Dropdown.Item>
      )}
      <SecondSubMenu handleExportFile={handleExportFile} button={button} label={label} />
    </Dropdown.Submenu>
  );
};

const ExportData = (props) => {
  const { data, dataFilter, dataOnPage, columns, isPageLabel, dataListPageExport } = props;
  const [isOpen, setIsOpen] = useState(false);
  const isSwitch = useSelector((state) => state.page.isQuickEdit);
  const label = useSelector((state) => state.language.label);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const handleExportFile = async (button, type) => {
    const dataExport = await getDataExport(type);
    const dataExportFormated = formatData(dataExport);
    switch (button) {
      case 'btnCsv':
        downloadCSV(dataExportFormated, label.titlePage.name);
        break;
      case 'btnExcel':
        downloadExcel(dataExportFormated, label.titlePage.name);
        break;
      case 'btnPdf':
        downloadPDF(dataExportFormated, columns, label, label.titlePage.name);
        break;
      default:
        break;
    }
  };
  const formatData = (data) => {
    let newData = [];
    data.forEach((item) => {
      var jsonStr = {};
      columns.forEach((col) => {
        if (col.visibility && !(col.key == 'action' || col.key == 'is_active')) {
          //  jsonStr[`${col.key}`] = item[`${col.key}`];
          jsonStr[`${col.label}`] = item[`${col.label}`];
        }
      });
      newData.push(jsonStr);
    });
    return newData;
  };

  const getDataExport = async (type) => {
    switch (type) {
      case 'all':
        return data ? data : await dataListPageExport(true);
        break;
      case 'filter':
        return dataFilter ? dataFilter : await dataListPageExport(false);
        break;
      case 'page':
        return dataOnPage;
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ marginLeft: '8px' }}>
      <Dropdown isOpen={isOpen} toggle={toggle}>
        <Dropdown.Toggle>
          {isSwitch ? <ChangeLabel label={label.btnExport} /> : <>{label.btnExport.name}</>}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <FristSubMenu handleExportFile={handleExportFile} button={'btnCsv'} label={label} />
          <FristSubMenu handleExportFile={handleExportFile} button={'btnExcel'} label={label} />
          <FristSubMenu handleExportFile={handleExportFile} button={'btnPdf'} label={label} />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ExportData;
