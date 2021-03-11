import { ErrorType } from '../../util/types/ErrorType';
import { UserInterface } from '../../util/interfaces/UserInterface';
import { UserAction } from '../actions';
import { UserTypes } from '../action-types';

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

const reducer = (state: UserState = initialState, action: UserAction) => {
  switch (action.type) {
    case UserTypes.GET_CURRENT_USER_START:
      return { ...state, errors: [], loading: true };
    case UserTypes.GET_CURRENT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        errors: [],
        currentUser: action.payload,
      };
    case UserTypes.GET_CURRENT_USER_ERROR:
      return {
        ...state,
        loading: false,
        errors: action.payload,
        currentUser: null,
      };
    case UserTypes.SIGN_IN_USER_START:
      return { ...state, loading: true, errors: [] };
    case UserTypes.SIGN_IN_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        errors: [],
        currentUser: action.payload,
      };
    case UserTypes.SIGN_IN_USER_ERROR:
      return { ...state, loading: false, errors: action.payload };
    case UserTypes.SIGN_OUT_USER_START:
      return { ...state, loading: true, errors: [] };
    case UserTypes.SIGN_OUT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        errors: [],
        currentUser: null,
      };
    case UserTypes.SIGN_OUT_USER_ERROR:
      return { ...state, loading: false, errors: action.payload };
    case UserTypes.REGISTER_USER_START:
      return { ...state, loading: true, errors: [] };
    case UserTypes.REGISTER_USER_SUCCESS:
      return { ...state, loading: false, currentUser: action.payload };
    case UserTypes.REGISTER_USER_ERROR:
      return { ...state, loading: false, errors: action.payload };
    default:
      return state;
  }
};
export default reducer;
