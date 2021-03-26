import { ErrorType } from '../../util/types/ErrorType';
import { UserAction } from '../actions';
import { UserTypes } from '../action-types';
import compose from 'immer';
import { UserPayload } from '@sin-nombre/sinfood-common';
import { UserAddress } from '../../util/interfaces/UserAddress';

export interface UserState {
  loading: boolean;
  authenticating: boolean;
  errors: ErrorType;
  currentUser: UserPayload | null;
  addresses: UserAddress[];
}
// We persist no sensitive data in localStorage
// So there is no issue initialize the currentUser state with the data from LS
const initialState: UserState = {
  loading: false,
  authenticating: true,
  errors: [],
  currentUser: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') as string)
    : null,
  addresses: [],
};

const reducer = compose(
  (state: UserState = initialState, action: UserAction): UserState => {
    switch (action.type) {
      case UserTypes.GET_CURRENT_USER_START:
        state.errors = [];
        state.authenticating = true;
        state.loading = true;
        return state;
      case UserTypes.GET_CURRENT_USER_SUCCESS:
        state.loading = false;
        state.authenticating = false;
        state.errors = [];
        state.currentUser = action.payload;
        return state;
      case UserTypes.GET_CURRENT_USER_ERROR:
        state.loading = false;
        state.authenticating = false;
        state.errors = action.payload;
        state.currentUser = null;
        return state;
      case UserTypes.SIGN_IN_USER_START:
        state.loading = true;
        state.errors = [];
        return state;
      case UserTypes.SIGN_IN_USER_SUCCESS:
        state.loading = false;
        state.errors = [];
        state.currentUser = action.payload;
        return state;
      case UserTypes.SIGN_IN_USER_ERROR:
        state.loading = false;
        state.errors = action.payload;
        return state;
      case UserTypes.SIGN_OUT_USER_START:
        state.loading = true;
        state.errors = [];
        return state;
      case UserTypes.SIGN_OUT_USER_SUCCESS:
        state.loading = false;
        state.errors = [];
        state.currentUser = null;
        state.addresses = [];
        return state;
      case UserTypes.SIGN_OUT_USER_ERROR:
        state.loading = false;
        state.errors = action.payload;
        return state;
      case UserTypes.REGISTER_USER_START:
        state.loading = true;
        state.errors = [];
        return state;
      case UserTypes.REGISTER_USER_SUCCESS:
        state.loading = false;
        state.currentUser = action.payload;
        return state;
      case UserTypes.REGISTER_USER_ERROR:
        state.loading = false;
        state.errors = action.payload;
        return state;
      case UserTypes.GET_CURRENT_USER_ADDRESSES_START:
        state.loading = true;
        return state;
      case UserTypes.GET_CURRENT_USER_ADDRESSES_SUCCESS:
        state.loading = false;
        state.addresses = action.payload;
        return state;
      case UserTypes.GET_CURRENT_USER_ADDRESSES_ERROR:
        state.loading = false;
        state.errors = action.payload;
        return state;
      case UserTypes.CLEAR_USER_ERRORS:
        state.loading = false;
        state.errors = [];
        return state;
      case UserTypes.ADD_USER_ADDRESS_START:
        state.loading = true;
        state.errors = [];
        return state;
      case UserTypes.ADD_USER_ADDRESS_SUCCESS:
        state.loading = false;
        state.addresses = [...state.addresses, action.payload];
        return state;
      case UserTypes.ADD_USER_ADDRESS_ERROR:
        state.loading = false;
        state.errors = action.payload;
        return state;
      default:
        return state;
    }
  },
);
export default reducer;
