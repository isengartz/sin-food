import { ModalTypes, UserTypes, UtilTypes } from '../action-types';
import { Dispatch } from 'redux';
import {
  Action,
  ClearUserErrorsAction,
  SelectUserAddress,
  UserAction,
} from '../actions';
import { SignInUserForm } from '../../util/interfaces/forms/SignInUserForm';
import { RegisterUserForm } from '../../util/interfaces/forms/RegisterUserForm';
import { handleAxiosErrorMessage } from '../../util/handleAxiosErrorMessage';
import axios from '../../apis/instances/user';
import { AppThunk } from '../../util/types/AppThunk';
import { UserAddress } from '../../util/interfaces/UserAddress';
import { clearCartData } from './orderActionCreator';

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

      if (currentUser) {
        // @ts-ignore
        dispatch(getCurrentUserFullPayload(currentUser.id));
      } else {
        dispatch({
          type: UserTypes.GET_CURRENT_USER_SUCCESS,
          payload: currentUser,
        });
      }

      // localStorage.setItem('user', JSON.stringify(currentUser));
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

      // @ts-ignore
      dispatch(getCurrentUserFullPayload(user.id));

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
      localStorage.setItem('user', JSON.stringify(user));
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
      localStorage.clear();

      // @ts-ignore
      dispatch(clearCartData());
    } catch (e) {
      dispatch({
        type: UserTypes.SIGN_OUT_USER_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

/**
 * Return all user addresses
 * @param userId
 */
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
      localStorage.setItem('userAddresses', JSON.stringify(addresses));
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

/**
 * Adds a new address
 * @param data
 */
export const addUserAddress = (data: UserAddress): AppThunk => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({ type: UserTypes.ADD_USER_ADDRESS_START });

    try {
      const {
        data: {
          data: { address },
        },
      } = await axios.post('/address', data);
      dispatch({
        type: UserTypes.ADD_USER_ADDRESS_SUCCESS,
        payload: address,
      });

      // If there are no addresses set it
      if (!localStorage.getItem('userAddresses')) {
        localStorage.setItem('userAddresses', JSON.stringify([address]));
      } else {
        // else push it in the current array
        const addresses = JSON.parse(
          localStorage.getItem('userAddresses') as string,
        );
        localStorage.setItem(
          'userAddresses',
          JSON.stringify([...addresses, address]),
        );
      }
    } catch (e) {
      dispatch({
        type: UserTypes.ADD_USER_ADDRESS_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

/**
 * Select a user's address
 * @param address
 */
export const selectUserAddress = (address: string): SelectUserAddress => {
  localStorage.setItem('selectedAddress', address);
  return {
    type: UserTypes.SELECT_USER_ADDRESS,
    payload: address,
  };
};

/**
 * Gets the full user payload
 */
export const getCurrentUserFullPayload = (id: string): AppThunk => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({ type: UserTypes.GET_CURRENT_USER_FULL_PAYLOAD_START });
    try {
      const {
        data: {
          data: { user },
        },
      } = await axios.get(`/${id}`);
      dispatch({
        type: UserTypes.GET_CURRENT_USER_FULL_PAYLOAD_SUCCESS,
        payload: user,
      });
      localStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
      dispatch({
        type: UserTypes.GET_CURRENT_USER_FULL_PAYLOAD_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};
