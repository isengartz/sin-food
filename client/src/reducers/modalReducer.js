import {HIDE_LOGIN_MODAL, SHOW_LOGIN_MODAL} from "../actions/types/modalTypes";

export default (state = { loginModal: false }, action) => {
  switch (action.type) {
    case SHOW_LOGIN_MODAL:
      return { ...state, loginModal: true };
    case HIDE_LOGIN_MODAL:
      return { ...state, loginModal: false };
    default:
      return state;
  }
};
