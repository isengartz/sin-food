import { Col } from 'antd';
import React, { useEffect } from 'react';
import { useActions } from '../../../hooks/useActions';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import {
  selectMenuCategoriesAsMap,
  selectMenuItemsSortedByCategory,
  selectSelectedRestaurant,
} from '../../../state';
import RestaurantMenuListWrapper from './RestaurantMenuListWrapper/RestaurantMenuListWrapper';

const RestaurantMenuList = () => {
  const { getMenuItems } = useActions();
  const selectedRestaurant = useTypedSelector(selectSelectedRestaurant);
  const menuCategories = useTypedSelector(selectMenuCategoriesAsMap);
  const menuItems = useTypedSelector(selectMenuItemsSortedByCategory);

  // console.log(menuItems, items);
  useEffect(() => {
    if (!selectedRestaurant) {
      return;
    }
    getMenuItems(selectedRestaurant.id);
  }, [selectedRestaurant, getMenuItems]);

  const wrappers: JSX.Element[] = [];
  menuItems &&
    menuItems.forEach((item, id) => {
      item &&
        menuCategories.get(id) &&
        wrappers.push(
          <RestaurantMenuListWrapper
            key={id}
            id={id}
            // @ts-ignore
            name={menuCategories.get(id)}
            items={item}
          />,
        );
    });

  return <Col span={12}>{wrappers}</Col>;
};

export default RestaurantMenuList;
