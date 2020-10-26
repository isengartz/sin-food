import React, { useEffect } from "react";
import { connect } from "react-redux";
import { clearError } from "../../actions/utilActions";
import { message } from "antd";
import { DEFAULT_POP_UP_MESSAGE_DURATION_SECONDS } from "../../utility/constants";

// Displays Error, Warning, Info Messages to the user
const DisplayMessage = ({ clearError, util: { errors } }) => {
  // Check if there are any errors and display them
  useEffect(() => {
    if (errors.length > 0) {
      message.error(buildErrors(), DEFAULT_POP_UP_MESSAGE_DURATION_SECONDS);
      // After Displaying the errors, clear the redux state
      clearError();
    }
  }, [errors]);

  // Builds the JSX for the Error Messages
  const buildErrors = () => {
    const errorsHtml = errors.map((error, index) => {
      return <li key={index}>{error.message}</li>;
    });
    return <ul>{errorsHtml}</ul>;
  };
  return <></>;
};
const mapStateToProps = (state) => {
  return {
    util: state.util,
  };
};
export default connect(mapStateToProps, { clearError })(DisplayMessage);
