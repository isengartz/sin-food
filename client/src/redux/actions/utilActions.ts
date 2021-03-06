import { UtilTypes } from '../action-types';
import { ErrorType } from '../../util/types/ErrorType';

export type UtilActions =
  | SetGlobalErrorMessage
  | ClearGlobalErrorMessage
  | SetGlobalNotificationMessage
  | ClearGlobalNotificationMessage;

interface SetGlobalErrorMessage {
  type: UtilTypes.SET_GLOBAL_ERROR_MESSAGE;
  payload: ErrorType;
}
interface ClearGlobalErrorMessage {
  type: UtilTypes.CLEAR_GLOBAL_ERROR_MESSAGE;
}

interface SetGlobalNotificationMessage {
  type: UtilTypes.SET_GLOBAL_NOTIFICATION_MESSAGE;
  payload: string;
}
interface ClearGlobalNotificationMessage {
  type: UtilTypes.CLEAR_GLOBAL_NOTIFICATION_MESSAGE;
}
