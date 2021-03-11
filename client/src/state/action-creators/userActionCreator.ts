import { ModalTypes, UserTypes, UtilTypes } from '../action-types';
import { Dispatch } from 'redux';
import { Action, ClearUserErrorsAction, UserAction } from '../actions';
import axios from 'axios';
import { SignInUserForm } from '../../util/interfaces/forms/SignInUserForm';
import { RegisterUserForm } from '../../util/interfaces/forms/RegisterUserForm';
import { handleAxiosErrorMessage } from '../../util/handleAxiosErrorMessage';

export const getCurrentUser = () => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({ type: UserTypes.GET_CURRENT_USER_START });
    try {
      const {
        data: {
          data: { currentUser },
        },
      } = await axios.get('/api/v1/users/currentUser');
      // @ts-ignore
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

export const signInUser = (data: SignInUserForm) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: UserTypes.SIGN_IN_USER_START });
    try {
      const {
        data: {
          data: { user },
        },
      } = await axios.post('/api/v1/users/login', data);
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

export const registerUser = (data: RegisterUserForm) => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({ type: UserTypes.REGISTER_USER_START });
    try {
      const {
        data: {
          data: { user },
        },
      } = await axios.post('/api/v1/users/signup', data);
      console.debug(user);
      // @ts-ignore
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

export const signOutUser = () => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({ type: UserTypes.SIGN_OUT_USER_START });
    try {
      await axios.post('/api/v1/users/signout');
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

export const clearUserErrors = (): ClearUserErrorsAction => {
  return {
    type: UserTypes.CLEAR_USER_ERRORS,
  };
};
