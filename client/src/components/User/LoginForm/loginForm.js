import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { signInUser } from "../../../actions/userActions";
import { showLoginModal, hideLoginModal } from "../../../actions/modalActions";
import { Form, Input, Button, Modal } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { HAS_ERROR } from "../../../actions/types/utilTypes";

const LoginForm = ({ signInUser, isVisible, hideLoginModal }) => {
  const formRef = useRef(null);
  let history = useHistory();

  const closeModal = () => {
    console.log("clicking...");
    hideLoginModal();
  };
  const onSubmit = async (values) => {
    const response = await signInUser(values);
    formRef.current.resetFields();
    if (response.type !== HAS_ERROR) {
      hideLoginModal();
      history.push("/");
    }
    console.debug(response);
  };

  return (
    <Modal visible={isVisible} onCancel={closeModal} footer={null}>
      <Form
        style={{ margin: "20px" }}
        ref={formRef}
        name="normal_login"
        onFinish={onSubmit}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    isVisible: state.modals.loginModal,
  };
};
export default connect(mapStateToProps, {
  signInUser,
  hideLoginModal,
  showLoginModal,
})(LoginForm);
