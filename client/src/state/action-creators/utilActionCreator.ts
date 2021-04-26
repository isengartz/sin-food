import {
  ClearGlobalErrorMessageAction,
  SetGlobalErrorMessageAction,
} from '../actions';
import { UtilTypes } from '../action-types';
import { ErrorType } from '../../util/types/ErrorType';

/**
 * Set a Global Error
 * @param errors
 */
export const setGlobalErrorMessage = (
  errors: ErrorType,
): SetGlobalErrorMessageAction => {
  return {
    type: UtilTypes.SET_GLOBAL_ERROR_MESSAGE,
    payload: errors,
  };
};

/**
 * Clear the global error from state
 */
export const clearGlobalErrorMessage = (): ClearGlobalErrorMessageAction => {
  return {
    type: UtilTypes.CLEAR_GLOBAL_ERROR_MESSAGE,
  };
};
