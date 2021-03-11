import { UtilTypes } from '../action-types';
import { ErrorType } from '../../util/types/ErrorType';

export type UtilActions =
  | SetGlobalErrorMessageAction
  | ClearGlobalErrorMessageAction
  | SetGlobalNotificationMessageAction
  | ClearGlobalNotificationMessageAction;

export interface SetGlobalErrorMessageAction {
  type: UtilTypes.SET_GLOBAL_ERROR_MESSAGE;
  payload: ErrorType;
}
export interface ClearGlobalErrorMessageAction {
  type: UtilTypes.CLEAR_GLOBAL_ERROR_MESSAGE;
}

export interface SetGlobalNotificationMessageAction {
  type: UtilTypes.SET_GLOBAL_NOTIFICATION_MESSAGE;
  payload: string;
}
export interface ClearGlobalNotificationMessageAction {
  type: UtilTypes.CLEAR_GLOBAL_NOTIFICATION_MESSAGE;
}
