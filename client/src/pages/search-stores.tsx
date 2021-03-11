import React from 'react';
import { Layout } from 'antd';

const { Content, Sider } = Layout;
const SearchStores: React.FC = () => {
  return (
    <Layout>
      <Sider>Sider stuff</Sider>
      <Content>Content Stuff</Content>
    </Layout>
  );
};

export default SearchStores;