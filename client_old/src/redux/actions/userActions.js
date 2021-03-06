import {
  GET_CURRENT_USER_ERROR,
  GET_CURRENT_USER_START,
  GET_CURRENT_USER_SUCCESS,
  LOG_OUT_USER,
  REGISTER_USER_ERROR,
  REGISTER_USER_START,
  REGISTER_USER_SUCCESS,
  SUCCESS_LOGIN,
  USER_LOGIN_START,
} from './types/userTypes';
import userInstance from '../../apis/instances/user';
import { ApiCaller } from '../../apis/ApiCaller';

const userApi = new ApiCaller(userInstance);

export const getCurrentUserStart = () => ({
  type: GET_CURRENT_USER_START,
});

// Gets current users information
export const getCurrentUser = () => ({
  type: GET_CURRENT_USER_SUCCESS,
  api: {
    apiCaller: userApi,
    method: 'get',
    url: 'currentUser',
    objectName: 'currentUser',
    beforeSend: getCurrentUserStart,
    onErrorType: GET_CURRENT_USER_ERROR,
  },
});

export const signInUserStart = () => ({
  type: USER_LOGIN_START,
});

// Tries to login the user
export const signInUser = (data) => ({
  type: SUCCESS_LOGIN,
  api: {
    apiCaller: userApi,
    method: 'post',
    url: 'login',
    objectName: 'user',
    data: data,
    beforeSend: signInUserStart,
    // onErrorType: USER_LOGIN_ERROR
  },
});

export const registerUserStart = () => ({
  type: REGISTER_USER_START,
});

export const registerUser = (data) => ({
  type: REGISTER_USER_SUCCESS,
  api: {
    apiCaller: userApi,
    method: 'post',
    url: 'signup',
    objectName: 'user',
    data: data,
    beforeSend: registerUserStart,
    onErrorType: REGISTER_USER_ERROR,
  },
});
// Signout user
export const signout = () => ({
  type: LOG_OUT_USER,
  api: {
    apiCaller: userApi,
    method: 'post',
    url: 'signout',
  },
});
