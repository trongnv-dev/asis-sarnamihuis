import TYPES from "store/types"

export function tokenChange(payload) {
  return {
    type: TYPES.TOKEN_CHANGE,
    payload: payload
  }
}
