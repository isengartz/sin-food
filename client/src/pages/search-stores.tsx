import React from 'react';
import { Layout } from 'antd';
import RestaurantCategoryList from '../components/store/RestaurantCategoryList/RestaurantCategoryList';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { selectRestaurantSearchIsLoading } from '../state';
import Loader from '../components/layout/Loader/Loader';

const { Content, Sider } = Layout;
const SearchStores: React.FC = () => {
  const loading = useTypedSelector(selectRestaurantSearchIsLoading);
  return (
    <Layout>
      <Sider theme="light">
        <RestaurantCategoryList />
      </Sider>
      <Content style={{ margin: '0 1rem' }}>Content Stuff</Content>
      {loading && <Loader />}
    </Layout>
  );
};

export default SearchStores;
