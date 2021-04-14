import {
  clearGlobalErrorMessage,
  clearRestaurantErrors,
  clearUserErrors,
} from '../../state/action-creators';

export type ErrorClearFunc =
  | typeof clearGlobalErrorMessage
  | typeof clearUserErrors
  | typeof clearRestaurantErrors;
