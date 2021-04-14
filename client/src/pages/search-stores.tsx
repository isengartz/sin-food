import React from 'react';
import { Layout } from 'antd';
import RestaurantCategoryList from '../components/store/RestaurantCategoryList/RestaurantCategoryList';
import { useTypedSelector } from '../hooks/useTypedSelector';
import {
  selectRestaurantErrors,
  selectRestaurantSearchIsLoading,
} from '../state';
import Loader from '../components/layout/Loader/Loader';
import RestaurantList from '../components/store/RestaurantList/RestaurantList';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { useActions } from '../hooks/useActions';

const { Content, Sider } = Layout;

const SearchStores: React.FC = () => {
  const loading = useTypedSelector(selectRestaurantSearchIsLoading);
  const errors = useTypedSelector(selectRestaurantErrors);
  const { clearRestaurantErrors } = useActions();
  useErrorMessage(errors, clearRestaurantErrors);
  return (
    <Layout>
      <Sider theme="light">
        <RestaurantCategoryList />
      </Sider>
      <Content style={{ margin: '0 1rem' }}>
        <RestaurantList />
      </Content>
      {loading && <Loader />}
    </Layout>
  );
};

export default SearchStores;
