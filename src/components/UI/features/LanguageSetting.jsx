import { Dropdown } from '@blueupcode/components';
import { swal } from 'components/swal/instance';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import languageApi from 'services/languageApi';
import styles from 'styles/pages/ui/features/language-setting.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as SolidIcon from '@fortawesome/free-solid-svg-icons';
const LanguageSetting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const languages = useSelector((state) => state.language.listLanguageActive);
  const currentLanguage = useSelector((state) => state.language.currentLanguage);

  function toggle() {
    const arr = languages.filter((item) => currentLanguage.id !== item.idLanguage);
    if (!(arr && arr.length > 0)) return;
    setIsOpen(!isOpen);
  }

  async function handleClick(id) {
    try {
      const response = await languageApi.setCurrentLanguage(id);
      if (response.data.code === 200) {
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
      swal.fire({ text: e.message, icon: 'error' });
    }
  }

  return (
    <div style={{ marginLeft: '8px' }}>
      <Dropdown isOpen={isOpen} toggle={toggle}>
        <Dropdown.Toggle>
          <row>
            <img src={currentLanguage.icon} alt={currentLanguage.name} />
            <FontAwesomeIcon icon={SolidIcon.faCaretDown} />
          </row>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {languages &&
            languages.length > 0 &&
            languages
              .filter((item) => currentLanguage.id !== item.idLanguage)
              .map((item, index) => (
                <div key={`language-setting-${index}`} onClick={() => handleClick(item.idLanguage)}>
                  <Dropdown.Item className={styles.item}>
                    <img src={item.icon} alt={item.name} />
                    <span>{item.name}</span>
                  </Dropdown.Item>
                </div>
              ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default LanguageSetting;
