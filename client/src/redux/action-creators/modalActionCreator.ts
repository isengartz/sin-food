import { Dispatch } from 'redux';
import { ModalAction } from '../actions';
import { ModalTypes } from '../action-types';

export const showLoginModal = () => {
  return async (dispatch: Dispatch<ModalAction>) => {
    dispatch({ type: ModalTypes.OPEN_USER_LOGIN_MODAL });
  };
};
export const closeLoginModal = () => {
  return async (dispatch: Dispatch<ModalAction>) => {
    dispatch({ type: ModalTypes.CLOSE_USER_LOGIN_MODAL });
  };
};
