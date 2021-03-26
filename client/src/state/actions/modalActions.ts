import { ModalTypes } from '../action-types/';

export type ModalAction =
  | ShowUserLoginModalAction
  | CloseUserLoginModalAction
  | ShowUserAddressModalAction
  | CloseUserAddressModalAction;

/**
 * User Login Modal Actions
 */
export interface ShowUserLoginModalAction {
  type: ModalTypes.OPEN_USER_LOGIN_MODAL;
}
export interface CloseUserLoginModalAction {
  type: ModalTypes.CLOSE_USER_LOGIN_MODAL;
}

/**
 * User Address Modal Actions
 */
export interface ShowUserAddressModalAction {
  type: ModalTypes.OPEN_USER_ADDRESS_MODAL;
}
export interface CloseUserAddressModalAction {
  type: ModalTypes.CLOSE_USER_ADDRESS_MODAL;
}
