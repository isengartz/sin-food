import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { clearError } from "../../actions/utilActions";
import { message } from "antd";
import { DEFAULT_POP_UP_MESSAGE_DURATION_SECONDS } from "../../utility/constants";

// Displays Error, Warning, Info Messages to the user
const DisplayMessage = ({ clearError, util: { errors, statusCode } }) => {
  let history = useHistory();
  // Check if there are any errors and display them
  useEffect(() => {
    if (errors.length > 0) {
      // redirect on severe errors
      // if (statusCode===500){
      //   history.push("/500")
      // }
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
    util: state.util
  };
};
export default connect(mapStateToProps, { clearError })(DisplayMessage);
