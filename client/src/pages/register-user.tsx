import React from 'react';
import { Col, Row } from 'antd';
import { Layout } from 'antd';
import RegisterForm from '../components/forms/user/RegisterForm/registerForm';
const { Content } = Layout;
const RegisterUserPage: React.FC = () => {
  return (
    <Content>
      <div className="page">
        <Row align="middle" justify="center">
          <Col span={12} className="mt-5">
            <RegisterForm />
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default RegisterUserPage;
