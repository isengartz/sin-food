import { HIDE_LOGIN_MODAL, SHOW_LOGIN_MODAL } from "./types/modalTypes";

export const showLoginModal = () => ({
  type: SHOW_LOGIN_MODAL,
});

export const hideLoginModal = () => ({
  type: HIDE_LOGIN_MODAL,
});
