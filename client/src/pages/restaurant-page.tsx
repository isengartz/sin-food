import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTypedSelector } from '../hooks/useTypedSelector';
import {
  selectMenuIsLoading,
  selectRestaurantErrors,
  selectRestaurantSearchIsLoading,
  selectSelectedRestaurant,
} from '../state';
import { useActions } from '../hooks/useActions';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { clearRestaurantErrors } from '../state/action-creators';
import { Layout, Row } from 'antd';
import Loader from '../components/layout/Loader/Loader';
import RestaurantMenuCategoryList from '../components/menu/RestaurantMenuCategoryList/RestaurantMenuCategoryList';
import RestaurantMenuList from '../components/menu/RestaurantMenuList/RestaurantMenuList';
import MenuItemModal from '../components/forms/menu/MenuItemModal/MenuItemModal';
import Cart from '../components/store/Cart/Cart';

const { Content } = Layout;

/**
 * Single Restaurant Page
 * @constructor
 */
const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const selectedRestaurant = useTypedSelector(selectSelectedRestaurant);
  const errors = useTypedSelector(selectRestaurantErrors);
  const loading = useTypedSelector(selectRestaurantSearchIsLoading);
  const menuIsLoading = useTypedSelector(selectMenuIsLoading);
  useErrorMessage(errors, clearRestaurantErrors);
  const { getRestaurant } = useActions();

  useEffect(() => {
    if (
      !selectedRestaurant ||
      (selectedRestaurant && selectedRestaurant.id !== id)
    ) {
      getRestaurant(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Layout>
      <Content style={{ padding: '0 50px' }}>
        <Row gutter={[16, 16]}>
          <RestaurantMenuCategoryList />
          <RestaurantMenuList />
          <Cart />
        </Row>
      </Content>
      {(loading || menuIsLoading) && <Loader />}
      <MenuItemModal />
    </Layout>
  );
};

export default RestaurantPage;
