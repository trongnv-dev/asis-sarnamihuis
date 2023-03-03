import TYPES from 'store/types';

const initialState = {
  theme: 'light',
  headerTitle: {
    name: 'United',
    id: 0,
    table: '',
    sort: '',
    code: '',
  },
  isQuickEdit: false,
};

function pageReducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.PAGE_CHANGE_HEADER_TITLE:
      return {
        ...state,
        headerTitle: {
          name: action.payload.name,
          id: action.payload.id,
          table: action.payload.table,
          sort: action.payload.sort,
          code: action.payload.code,
        },
      };
    case TYPES.PAGE_CHANGE_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    case TYPES.QUICK_EDIT:
      return {
        ...state,
        isQuickEdit: action.payload,
      };
    default:
      return state;
  }
}

export default pageReducer;
