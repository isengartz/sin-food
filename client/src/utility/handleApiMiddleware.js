import { HAS_ERROR } from "../actions/types/utilTypes";

// Redux Middleware  to handle calls to the API
export default (store) => (next) => async (action) => {
  if (action.api) {
    try {
      const { method, url, data, axios, objectName } = action.api;
      const response = await axios({
        method: method || "get",
        url: url,
        data: data || {},
      });
      // If API respond with error
      // Change the action type to error
      // And attach the errors as payload
      if (response.data.type === "error") {
        action.type = HAS_ERROR;
        action.payload = response.data.errors;
      } else {
        action.payload = objectName
          ? response.data.data[objectName]
          : response.data.data;
      }
    } catch (error) {
      // the same as above so we can grab and other errors like network
      action.type = HAS_ERROR;
      // If the api doesnt contain errors return the axios message instead
      action.payload = error.response.data.errors || error.message;
    }
  }
  return next(action);
};
