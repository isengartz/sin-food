import React from "react";
import { Layout, Row, Col } from "antd";
import "../assets/less/pages/home-page.less";
import LoginForm from "../components/User/LoginForm/loginForm";
const { Content } = Layout;
const HomePage = () => {
  return (
    <Content>
        <div className="home-wrapper">
      <Row align="middle" justify="center"  >
        <Col span={6} className="">
          <LoginForm />
        </Col>
      </Row>
        </div>
    </Content>
  );
};

export default HomePage;
