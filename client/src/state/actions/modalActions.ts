import { ModalTypes } from '../action-types/';

export type ModalAction = ShowUserLoginModalAction | CloseUserLoginModalAction;

/**
 * User Login Modal Actions
 */
export interface ShowUserLoginModalAction {
  type: ModalTypes.OPEN_USER_LOGIN_MODAL;
}
export interface CloseUserLoginModalAction {
  type: ModalTypes.CLOSE_USER_LOGIN_MODAL;
}
