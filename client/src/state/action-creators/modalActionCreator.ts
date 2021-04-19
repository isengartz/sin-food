import {
  CloseMenuItemModalAction,
  CloseUserAddressModalAction,
  CloseUserLoginModalAction,
  ShowMenuItemModalAction,
  ShowUserAddressModalAction,
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

export const showUserAddressModal = (): ShowUserAddressModalAction => {
  return {
    type: ModalTypes.OPEN_USER_ADDRESS_MODAL,
  };
};

export const closeUserAddressModal = (): CloseUserAddressModalAction => {
  return {
    type: ModalTypes.CLOSE_USER_ADDRESS_MODAL,
  };
};

export const showMenuItemModal = (): ShowMenuItemModalAction => {
  return {
    type: ModalTypes.OPEN_MENU_ITEM_MODAL,
  };
};

export const closeMenuItemModal = (): CloseMenuItemModalAction => {
  return {
    type: ModalTypes.CLOSE_MENU_ITEM_MODAL,
  };
};
