import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { DEFAULT_POP_UP_MESSAGE_DURATION_SECONDS } from '../../utility/constants';
import { message } from 'antd';
import { clearError } from '../../redux/actions/utilActions';
import {
  selectUtilErrors,
  selectUtilNotification,
} from '../../redux/selectors/util.selectors';
import { buildErrorMessage } from '../../utility/helper';

// Displays Error, Warning, Info Messages to the user
const DisplayGlobalMessage = ({ clearError, utilErrors, utilNotification }) => {
  // eslint-disable-next-line no-unused-vars
  let history = useHistory();

  // Check if there are any errors and display them
  useEffect(() => {
    // Builds the JSX for the Error Messages

    if (utilErrors.length > 0) {
      // redirect on severe errors
      // if (statusCode===500){
      //   history.push("/500")
      // }
      message.error(
        buildErrorMessage(utilErrors),
        DEFAULT_POP_UP_MESSAGE_DURATION_SECONDS,
      );
      // After Displaying the errors, clear the redux state
      clearError();
    }
  }, [utilErrors, utilNotification, clearError]);

  return <></>;
};
const mapStateToProps = createStructuredSelector({
  utilErrors: selectUtilErrors,
  utilNotification: selectUtilNotification,
});
export default connect(mapStateToProps, { clearError })(DisplayGlobalMessage);
