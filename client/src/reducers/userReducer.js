import {
  GET_CURRENT_USER,
  LOG_OUT_USER,
  SHOW_LOGIN_MODAL,
  SUCCESS_LOGIN,
} from "../actions/types/userTypes";

const defaultState = null;
export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_CURRENT_USER:
      return action.payload;
    case SUCCESS_LOGIN:
      return action.payload;
    case LOG_OUT_USER:
      return null;
    default:
      return state;
  }
};
