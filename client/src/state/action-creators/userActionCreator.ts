import { ModalTypes, UserTypes, UtilTypes } from '../action-types';
import { Dispatch } from 'redux';
import { Action, ClearUserErrorsAction, UserAction } from '../actions';
import { SignInUserForm } from '../../util/interfaces/forms/SignInUserForm';
import { RegisterUserForm } from '../../util/interfaces/forms/RegisterUserForm';
import { handleAxiosErrorMessage } from '../../util/handleAxiosErrorMessage';
import axios from '../../apis/instances/user';
import { AppThunk } from '../../util/types/AppThunk';

// How using the HandleApiMiddleware action would look like if I wired it
// export const getCurrentUser = () => ({
//   type: UserTypes.GET_CURRENT_USER_SUCCESS,
//   api: {
//     apiCaller: axios,
//     method: 'get',
//     url: 'currentUser',
//     objectName: 'currentUser',
//     beforeSend: UserTypes.GET_CURRENT_USER_START,
//     onErrorType: UserTypes.GET_CURRENT_USER_ERROR,
//   },
// });

/**
 * Get Current User JWT Data
 * Used to see if user is logged in
 */
export const getCurrentUser = (): AppThunk => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({ type: UserTypes.GET_CURRENT_USER_START });
    try {
      const {
        data: {
          data: { currentUser },
        },
      } = await axios.get('/currentUser');
      dispatch({
        type: UserTypes.GET_CURRENT_USER_SUCCESS,
        payload: currentUser,
      });
    } catch (e) {
      dispatch({
        type: UserTypes.GET_CURRENT_USER_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

/**
 * Sign in current user
 * @param data
 */
export const signInUser = (data: SignInUserForm): AppThunk => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: UserTypes.SIGN_IN_USER_START });
    try {
      const {
        data: {
          data: { user },
        },
      } = await axios.post('/login', data);

      dispatch({
        type: UserTypes.SIGN_IN_USER_SUCCESS,
        payload: user,
      });
      dispatch({
        type: ModalTypes.CLOSE_USER_LOGIN_MODAL,
      });
    } catch (e) {
      // Push the error at the global Error Stack
      dispatch({
        type: UtilTypes.SET_GLOBAL_ERROR_MESSAGE,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

/**
 * Registers Current User
 * @param data
 */
export const registerUser = (data: RegisterUserForm): AppThunk => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({ type: UserTypes.REGISTER_USER_START });

    try {
      const {
        data: {
          data: { user },
        },
      } = await axios.post('/signup', data);
      dispatch({
        type: UserTypes.REGISTER_USER_SUCCESS,
        payload: user,
      });
    } catch (e) {
      dispatch({
        type: UserTypes.REGISTER_USER_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

/**
 * Signout the current signed in user
 */
export const signOutUser = (): AppThunk => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({ type: UserTypes.SIGN_OUT_USER_START });
    try {
      await axios.post('/signout');
      dispatch({
        type: UserTypes.SIGN_OUT_USER_SUCCESS,
      });
    } catch (e) {
      dispatch({
        type: UserTypes.SIGN_OUT_USER_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

export const getCurrentUserAddresses = (userId: string): AppThunk => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: UserTypes.GET_CURRENT_USER_ADDRESSES_START,
    });

    try {
      const {
        data: {
          data: { addresses },
        },
      } = await axios.get(`${userId}/address`);
      dispatch({
        type: UserTypes.GET_CURRENT_USER_ADDRESSES_SUCCESS,
        payload: addresses,
      });
    } catch (e) {
      dispatch({
        type: UserTypes.GET_CURRENT_USER_ADDRESSES_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

/**
 * Clear the user error from Reducer
 */
export const clearUserErrors = (): ClearUserErrorsAction => {
  return {
    type: UserTypes.CLEAR_USER_ERRORS,
  };
};
