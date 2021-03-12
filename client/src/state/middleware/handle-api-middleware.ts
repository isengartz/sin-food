import { Store } from 'redux';
import { Action } from '../actions';
import { AxiosError, AxiosResponse } from 'axios';
import { ModalTypes, UserTypes, UtilTypes } from '../action-types';

/**
 * Redux middleware that handles Api calls
 * I wont use it because at the end it makes things more complicated
 * But im leaving it for the memories !
 * Wasted too much time searching for something similar before creating it from scratch.
 * @todo: If I ever find time I should finish it
 * Should add support for afterFinish Actions also fix the TS support
 * @param store
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default (store: Store) => (next: (action: Action) => void) => async (
  action: Action,
) => {
  // I should use a different type of Action for Example ApiAction
  // And implement an interface that describes the api object
  // @ts-ignore
  if (action.api) {
    const {
      method,
      url,
      data,
      apiCaller,
      objectName,
      beforeSend,
      onErrorType,
      // @ts-ignore
    } = action.api;

    try {
      // executes a function before the actual request
      // useful so we can dispatch actions like *_START (example: GET_CURRENT_USER_START)
      if (beforeSend) {
        if (typeof beforeSend === 'function') {
          store.dispatch(beforeSend());
        } else {
          store.dispatch({ type: beforeSend });
        }
      }

      // Execute the HTTP Req
      const response: AxiosResponse = await apiCaller.request({
        method: method || 'get',
        url: url,
        data: data || {},
      });

      console.info(response);

      // If API respond with error
      // Change the action type to error
      // And attach the errors as payload
      if (response.data.type === 'error') {
        action = handleErrors(action, response.data.errors, onErrorType);
      } else {
        // @ts-ignore
        action.payload = objectName
          ? response.data.data[objectName]
          : response.data.data;
      }
    } catch (error) {
      // the same as above so we can grab and other errors like network
      action = handleErrors(action, error, onErrorType);
    }
  }
  return next(action);
};

const handleErrors = (
  action: Action,
  error: AxiosError | Error,
  onErrorType: UtilTypes | UserTypes | ModalTypes,
): Action => {
  console.error(error);
  return {
    ...action,
    type: onErrorType || UtilTypes.SET_GLOBAL_ERROR_MESSAGE,
    // @ts-ignore
    payload: error.response.data.errors || [{ message: error.message }],
  };
};
