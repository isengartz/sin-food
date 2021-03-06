import { Dispatch } from 'redux';
import { UtilActions } from '../actions';
import { UtilTypes } from '../action-types';
import { ErrorType } from '../../util/types/ErrorType';

export const setGlobalErrorMessage = (errors: ErrorType) => {
  return async (dispatch: Dispatch<UtilActions>) => {
    dispatch({ type: UtilTypes.SET_GLOBAL_ERROR_MESSAGE, payload: errors });
  };
};

export const clearGlobalErrorMessage = () => {
  return async (dispatch: Dispatch<UtilActions>) => {
    dispatch({ type: UtilTypes.CLEAR_GLOBAL_ERROR_MESSAGE });
  };
};
