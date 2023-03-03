import TYPES from "store/types"

const initialState = null

function tokenReducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.TOKEN_CHANGE:
      return action.payload
    default:
      return state
  }
}

export default tokenReducer
