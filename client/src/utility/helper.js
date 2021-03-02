import React from 'react';

export const buildErrorMessage = (errors) => {
  const errorsHtml = errors.map((error, index) => {
    return <li key={index}>{error.message}</li>;
  });
  return <ul className="errors-list">{errorsHtml}</ul>;
};
