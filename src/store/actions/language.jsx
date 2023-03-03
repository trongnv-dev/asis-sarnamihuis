import TYPES from 'store/types';

export function setCurrentLanguage(payload) {
  return {
    type: TYPES.CURRENT_LANGUAGE,
    payload: payload,
  };
}

export function setCurrentLanguageList(payload) {
  return {
    type: TYPES.CURRENT_LANGUAGE_LIST,
    payload: payload,
  };
}

export function setLanguage(payload) {
  return {
    type: TYPES.LANGUAGE,
    payload: payload,
  };
}

export function setLabel(payload) {
  return {
    type: TYPES.SAVE_LABEL,
    payload: payload,
  };
}
