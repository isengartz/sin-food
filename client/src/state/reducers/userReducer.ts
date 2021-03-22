import { ErrorType } from '../../util/types/ErrorType';
import { UserInterface } from '../../util/interfaces/UserInterface';
import { UserAction } from '../actions';
import { UserTypes } from '../action-types';
import compose from 'immer';

interface UserState {
  loading: boolean;
  errors: ErrorType;
  currentUser: UserInterface | null;
}

const initialState: UserState = {
  loading: false,
  errors: [],
  currentUser: null,
};

const reducer = compose(
  (state: UserState = initialState, action: UserAction): UserState => {
    switch (action.type) {
      case UserTypes.GET_CURRENT_USER_START:
        state.errors = [];
        state.loading = true;
        return state;
      case UserTypes.GET_CURRENT_USER_SUCCESS:
        state.loading = false;
        state.errors = [];
        state.currentUser = action.payload;
        return state;
      case UserTypes.GET_CURRENT_USER_ERROR:
        state.loading = false;
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
        state.currentUser!.addresses = action.payload;
        return state;
      case UserTypes.GET_CURRENT_USER_ADDRESSES_ERROR:
        state.loading = false;
        state.errors = action.payload;
        return state;
      case UserTypes.CLEAR_USER_ERRORS:
        state.loading = false;
        state.errors = [];
        return state;
      default:
        return state;
    }
  },
);
export default reducer;
