import { HAS_ERROR } from '../redux/actions/types/utilTypes';

// Redux Middleware  to handle calls to the API
export default (store) => (next) => async (action) => {

  if (action.api) {
    const {
      method,
      url,
      data,
      apiCaller,
      objectName,
      beforeSend,
      onErrorType,
    } = action.api;

    try {
      // executes a function before the actual request
      // useful so we can dispatch actions like *_START (example: GET_CURRENT_USER_START)
      if (beforeSend && typeof beforeSend === 'function') {
        store.dispatch(beforeSend());
      }

      // Execute the HTTP Req
      const response = await apiCaller.client.request({
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
        action.payload = objectName
          ? response.data.data[objectName]
          : response.data.data;
      }
    } catch (error) {
      // the same as above so we can grab and other errors like network
      action = handleErrors(action,error,onErrorType);
    }
  }
  return next(action);
};

const handleErrors = (action, error, onErrorType) => {
  return {
    ...action,
    type: onErrorType || HAS_ERROR,
    payload: error.response.data.errors || [{ message: error.message }],
    statusCode: error.response.status,
  };
};
