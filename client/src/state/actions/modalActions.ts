import { ModalTypes } from '../action-types/';

export type ModalAction =
  | ShowUserLoginModalAction
  | CloseUserLoginModalAction
  | ShowUserAddressModalAction
  | CloseUserAddressModalAction
  | ShowMenuItemModalAction
  | CloseMenuItemModalAction;

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

/**
 * Menu Item Modal Actions
 */
export interface ShowMenuItemModalAction {
  type: ModalTypes.OPEN_MENU_ITEM_MODAL;
}

export interface CloseMenuItemModalAction {
  type: ModalTypes.CLOSE_MENU_ITEM_MODAL;
}
