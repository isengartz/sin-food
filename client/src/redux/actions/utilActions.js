import {
  CLEAR_ERROR,
  HAS_ERROR,
  IS_LOADING,
  STOP_LOADING,
} from './types/utilTypes';

// Display an error message
export const setError = (errors, statusCode) => ({
  type: HAS_ERROR,
  payload: errors,
  statusCode,
});
// Clear all error messages
export const clearError = () => ({
  type: CLEAR_ERROR,
});

// Show loading spinner
export const startLoading = () => ({
  type: IS_LOADING,
});

export const stopLoading = () => ({
  type: STOP_LOADING,
});
