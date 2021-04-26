import React from 'react';
import { Layout, Row, Col } from 'antd';
import '../assets/less/pages/home-page.less';
import HomeUserAddressSection from '../components/page-specific/home/HomeUserAddressSection';

const { Content } = Layout;

/**
 * Home Page
 * @constructor
 */
const HomePage: React.FC = () => {
  return (
    <Content>
      <div className="home-wrapper">
        <Row align="middle" justify="center">
          <Col span={8} style={{ marginTop: '10%' }} className="">
            <HomeUserAddressSection />
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default HomePage;
