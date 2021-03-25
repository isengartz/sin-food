import { UserTypes } from '../action-types';
import { UserInterface } from '../../util/interfaces/UserInterface';
import { ErrorType } from '../../util/types/ErrorType';
import { UserAddress } from '../../util/interfaces/UserAddress';
import { UserPayload } from '@sin-nombre/sinfood-common';

export type UserAction =
  | GetCurrentUserAction
  | GetCurrentUserErrorAction
  | GetCurrentUserSuccessAction
  | SignInUserStartAction
  | SignInUserSuccessAction
  | SignInUserErrorAction
  | SignOutUserStartAction
  | SignOutUserSuccessAction
  | SignOutUserErrorAction
  | RegisterUserStartAction
  | RegisterUserSuccessAction
  | RegisterUserErrorAction
  | ClearUserErrorsAction
  | GetCurrentUserAddressesErrorAction
  | GetCurrentUserAddressesStartAction
  | GetCurrentUserAddressesSuccessAction;

/**
 * Get Current User Actions
 */
interface GetCurrentUserAction {
  type: UserTypes.GET_CURRENT_USER_START;
}
interface GetCurrentUserSuccessAction {
  type: UserTypes.GET_CURRENT_USER_SUCCESS;
  payload: UserPayload;
}
interface GetCurrentUserErrorAction {
  type: UserTypes.GET_CURRENT_USER_ERROR;
  payload: ErrorType;
}

/**
 * Sign in User Action
 */
interface SignInUserStartAction {
  type: UserTypes.SIGN_IN_USER_START;
}
interface SignInUserSuccessAction {
  type: UserTypes.SIGN_IN_USER_SUCCESS;
  payload: UserPayload;
}
interface SignInUserErrorAction {
  type: UserTypes.SIGN_IN_USER_ERROR;
  payload: ErrorType;
}

/**
 * Register User Actions
 */
interface RegisterUserStartAction {
  type: UserTypes.REGISTER_USER_START;
}
interface RegisterUserSuccessAction {
  type: UserTypes.REGISTER_USER_SUCCESS;
  payload: UserPayload;
}
interface RegisterUserErrorAction {
  type: UserTypes.REGISTER_USER_ERROR;
  payload: ErrorType;
}

/**
 * Log out Actions
 */
interface SignOutUserStartAction {
  type: UserTypes.SIGN_OUT_USER_START;
}
interface SignOutUserSuccessAction {
  type: UserTypes.SIGN_OUT_USER_SUCCESS;
}
interface SignOutUserErrorAction {
  type: UserTypes.SIGN_OUT_USER_ERROR;
  payload: ErrorType;
}

/**
 * Clear User Error
 */
export interface ClearUserErrorsAction {
  type: UserTypes.CLEAR_USER_ERRORS;
}

/**
 * Get User Addresses
 */
export interface GetCurrentUserAddressesStartAction {
  type: UserTypes.GET_CURRENT_USER_ADDRESSES_START;
}

export interface GetCurrentUserAddressesSuccessAction {
  type: UserTypes.GET_CURRENT_USER_ADDRESSES_SUCCESS;
  payload: UserAddress[];
}

export interface GetCurrentUserAddressesErrorAction {
  type: UserTypes.GET_CURRENT_USER_ADDRESSES_ERROR;
  payload: ErrorType;
}
