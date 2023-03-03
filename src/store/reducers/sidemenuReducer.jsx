import TYPES from "store/types"

const initialState = {
  agenda: false,
  setting: false,
  navigation: false
}

function sidemenuReducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.SIDEMENU_TOGGLE:
      return {
        ...state,
        [action.payload]: !state[action.payload]
      }
    case TYPES.SIDEMENU_CHANGE:
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
    case TYPES.SIDEMENU_UPDATE:
      return {
        ...state,
        needUpdate: action.payload,
      };
    default:
      return state
  }
}

export default sidemenuReducer
