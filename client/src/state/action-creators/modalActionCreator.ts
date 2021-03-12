import {
  CloseUserLoginModalAction,
  ShowUserLoginModalAction,
} from '../actions';
import { ModalTypes } from '../action-types';

export const showLoginModal = (): ShowUserLoginModalAction => {
  return {
    type: ModalTypes.OPEN_USER_LOGIN_MODAL,
  };
};
export const closeLoginModal = (): CloseUserLoginModalAction => {
  return {
    type: ModalTypes.CLOSE_USER_LOGIN_MODAL,
  };
};
