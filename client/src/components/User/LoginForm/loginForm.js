import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { signInUser } from '../../../redux/actions/userActions';
import {
  showLoginModal,
  hideLoginModal,
} from '../../../redux/actions/modalActions';
import { Form, Input, Button, Modal, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { selectLoginModal } from '../../../redux/selectors/modal.selectors';
import { createStructuredSelector } from 'reselect';
import { SUCCESS_LOGIN } from '../../../redux/actions/types/userTypes';

const LoginForm = ({ signInUser, isVisible, hideLoginModal }) => {
  const [formRef] = Form.useForm();
  let history = useHistory();

  const closeModal = () => {
    hideLoginModal();
  };
  const onSubmit = async (values) => {
    const response = await signInUser(values);
    formRef.resetFields();

    // Close Modal on successful login
    if (response.type === SUCCESS_LOGIN) {
      hideLoginModal();
      history.push('/');
    }
  };

  return (
    <Modal visible={isVisible} onCancel={closeModal} footer={null}>
      <Form
        style={{ margin: '20px' }}
        form={formRef}
        name="normal_login"
        onFinish={onSubmit}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            <span>
              Or <Link to="/register">register</Link> now!{' '}
            </span>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const mapStateToProps = createStructuredSelector({
  isVisible: selectLoginModal,
});
export default connect(mapStateToProps, {
  signInUser,
  hideLoginModal,
  showLoginModal,
})(LoginForm);
