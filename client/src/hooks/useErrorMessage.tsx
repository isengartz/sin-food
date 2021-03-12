import { ErrorType } from '../util/types/ErrorType';
import React, { useEffect } from 'react';
import { message } from 'antd';
import BuildErrorMessage from '../components/layout/BuildErrorMessage';
import { DEFAULT_POP_UP_MESSAGE_DURATION_SECONDS } from '../util/constants';
import { ErrorClearFunc } from '../util/types/ErrorClearFunc';

/**
 * Shows an error message and dispatch an action to clear the error state after
 * @param errors
 * @param clearErrors
 */
export const useErrorMessage = (
  errors: ErrorType,
  clearErrors: ErrorClearFunc,
) => {
  useEffect(() => {
    if (errors.length > 0) {
      message.error(
        <BuildErrorMessage errors={errors} />,
        DEFAULT_POP_UP_MESSAGE_DURATION_SECONDS,
      );
      // After Displaying the errors, clear the redux state
      clearErrors();
    }
  }, [errors, clearErrors]);
};
