import { UserTypes } from '../action-types';
import { UserInterface } from '../../util/interfaces/UserInterface';
import { ErrorType } from '../../util/types/ErrorType';

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
  | ClearUserErrorsAction;

/**
 * Get Current User Actions
 */
interface GetCurrentUserAction {
  type: UserTypes.GET_CURRENT_USER_START;
}
interface GetCurrentUserSuccessAction {
  type: UserTypes.GET_CURRENT_USER_SUCCESS;
  payload: UserInterface;
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
  payload: UserInterface;
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
  payload: UserInterface;
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
