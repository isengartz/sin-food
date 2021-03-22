import React from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { Form, Input, Button, Modal, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useActions } from '../../../../hooks/useActions';
import { SignInUserForm } from '../../../../util/interfaces/forms/SignInUserForm';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { selectCurrentUser, selectUserLoginModal } from '../../../../state';

const LoginForm = () => {
  const [formRef] = Form.useForm();
  let history = useHistory();

  const isVisible = useTypedSelector(selectUserLoginModal);
  const user = useTypedSelector(selectCurrentUser);
  const { closeLoginModal, signInUser } = useActions();

  const closeModal = () => {
    closeLoginModal();
  };

  const onSubmit = (values: SignInUserForm) => {
    signInUser(values);
    formRef.resetFields();
  };

  // Redirect when user log in
  if (user) {
    history.push('/');
    return <Redirect to="/" />;
  }
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
              Or
              <Link onClick={closeLoginModal} to="/register">
                register
              </Link>
              now!
            </span>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginForm;
