import { ModalAction } from '../actions';
import { ModalTypes } from '../action-types';

interface ModalState {
  userLoginModal: boolean;
  userAddressModal: boolean;
  menuItemModal: boolean;
}

const initialState: ModalState = {
  userLoginModal: false,
  userAddressModal: false,
  menuItemModal: false,
};

const reducer = (
  state: ModalState = initialState,
  action: ModalAction,
): ModalState => {
  switch (action.type) {
    case ModalTypes.OPEN_USER_LOGIN_MODAL:
      return { ...state, userLoginModal: true };
    case ModalTypes.CLOSE_USER_LOGIN_MODAL:
      return { ...state, userLoginModal: false };
    case ModalTypes.OPEN_USER_ADDRESS_MODAL:
      return { ...state, userAddressModal: true };
    case ModalTypes.CLOSE_USER_ADDRESS_MODAL:
      return { ...state, userAddressModal: false };
    case ModalTypes.OPEN_MENU_ITEM_MODAL:
      return { ...state, menuItemModal: true };
    case ModalTypes.CLOSE_MENU_ITEM_MODAL:
      return { ...state, menuItemModal: false };
    default:
      return state;
  }
};

export default reducer;
