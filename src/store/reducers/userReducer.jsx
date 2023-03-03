import TYPES from "store/types"

const initialState = null

function userReducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.SAVE_USER:
      return action.payload
    default:
      return state
  }
}

export default userReducer
