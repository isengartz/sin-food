import React from 'react';
import { ErrorType } from '../../util/types/ErrorType';

interface BuildErrorMessageProps {
  errors: ErrorType;
}

/**
 * Shows a list of error messages
 * @param errors
 * @constructor
 */
const BuildErrorMessage: React.FC<BuildErrorMessageProps> = ({ errors }) => {
  const errorsHtml = errors.map((error, index) => {
    return <li key={index}>{error.message}</li>;
  });
  return <ul className="errors-list">{errorsHtml}</ul>;
};

export default BuildErrorMessage;
