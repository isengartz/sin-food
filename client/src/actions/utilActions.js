import {
  CLEAR_ERROR,
  HAS_ERROR,
  IS_LOADING,
  STOP_LOADING,
} from "./types/utilTypes";

// Display an error message
export const setError = (errors,statusCode) => {
  return (dispatch) => {
    dispatch({
      type: HAS_ERROR,
      payload: errors,
      statusCode
    });
  };
};
// Clear all error messages
export const clearError = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_ERROR,
    });
  };
};

// Show loading spinner
export const startLoading = () => {
  return async (dispatch) => {
    dispatch({
      type: IS_LOADING,
    });
  };
};

export const stopLoading = () => {
  return async (dispatch) => {
    dispatch({
      type: STOP_LOADING,
    });
  };
};
