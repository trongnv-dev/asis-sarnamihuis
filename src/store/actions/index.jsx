import { asideChange, asideToggle } from './asideAction';
import { breadcrumbChange } from './breadcrumbAction';
import { firebaseChange } from './firebaseAction';
import { setCurrentLanguage, setCurrentLanguageList, setLanguage, setLabel } from './language';
import { pageChangeHeaderTitle, pageChangeTheme, handleQuickEdit } from './pageAction';
import { sidemenuChange, sidemenuToggle, asideMenuUpdate } from './sidemenuAction';
import { tokenChange } from './tokenAction';
import { saveUser } from './userAction';

// Export all actions
export {
  pageChangeHeaderTitle,
  breadcrumbChange,
  pageChangeTheme,
  sidemenuToggle,
  sidemenuChange,
  asideToggle,
  asideChange,
  asideMenuUpdate,
  firebaseChange,
  tokenChange,
  setCurrentLanguage,
  setCurrentLanguageList,
  setLanguage,
  handleQuickEdit,
  setLabel,
  saveUser,
};
