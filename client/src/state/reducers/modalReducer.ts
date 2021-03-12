import { ModalAction } from '../actions';
import { ModalTypes } from '../action-types';

interface ModalState {
  userLoginModal: boolean;
}

const initialState: ModalState = {
  userLoginModal: false,
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
    default:
      return state;
  }
};

export default reducer;
