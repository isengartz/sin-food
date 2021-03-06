import React from 'react';

import { useActions } from '../../hooks/useActions';
import { useErrorMessage } from '../../hooks/useErrorMessage';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { selectGlobalErrorMessages } from '../../redux';
// Displays Error, Warning, Info Messages to the user
const DisplayGlobalMessage = () => {
  const errors = useTypedSelector(selectGlobalErrorMessages);
  const { clearGlobalErrorMessage } = useActions();
  useErrorMessage(errors, clearGlobalErrorMessage);


  return <></>;
};

export default DisplayGlobalMessage;
