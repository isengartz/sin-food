import { ModalAction } from '../actions';
import { ModalTypes } from '../action-types';

interface ModalState {
  userLoginModal: boolean;
  userAddressModal: boolean;
}

const initialState: ModalState = {
  userLoginModal: false,
  userAddressModal: false,
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
    default:
      return state;
  }
};

export default reducer;
