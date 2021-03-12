import { UtilTypes } from '../../action-types';
import {
  clearGlobalErrorMessage,
  setGlobalErrorMessage,
} from '../utilActionCreator';

describe('Tests the Util Action Creators', () => {
  it('should create an action to set global error message', () => {
    const errorMessages = [
      {
        message: 'Random Error Message',
      },
    ];
    const expectedAction = {
      type: UtilTypes.SET_GLOBAL_ERROR_MESSAGE,
      payload: errorMessages,
    };
    expect(setGlobalErrorMessage(errorMessages)).toEqual(expectedAction);
  });

  it('should create an action to clear global error message', () => {
    const expectedAction = {
      type: UtilTypes.CLEAR_GLOBAL_ERROR_MESSAGE,
    };
    expect(clearGlobalErrorMessage()).toEqual(expectedAction);
  });
});
