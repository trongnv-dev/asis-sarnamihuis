import TYPES from 'store/types';

const initialState = {
  currentLanguage: {},
  listLanguageActive: [],
  label: [],
};

function language(state = initialState, action) {
  switch (action.type) {
    case TYPES.CURRENT_LANGUAGE:
      return {
        ...state,
        ...action.payload,
      };
    case TYPES.CURRENT_LANGUAGE_LIST:
      return {
        ...state,
        ...action.payload,
      };
    case TYPES.SAVE_LABEL:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default language;
