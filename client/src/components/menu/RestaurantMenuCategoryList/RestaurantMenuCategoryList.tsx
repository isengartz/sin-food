import React, { useEffect } from 'react';
import { Anchor, Col, Typography } from 'antd';
import { useActions } from '../../../hooks/useActions';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { selectMenuCategories, selectSelectedRestaurant } from '../../../state';

const { Link } = Anchor;
const { Title } = Typography;

/**
 * Renders a Fixed List with restaurant menu categories
 * @constructor
 */
const RestaurantMenuCategoryList = () => {
  const { getMenuCategories } = useActions();
  const menuCategories = useTypedSelector(selectMenuCategories);
  const selectedRestaurant = useTypedSelector(selectSelectedRestaurant);

  useEffect(() => {
    if (!selectedRestaurant) {
      return;
    }
    getMenuCategories(selectedRestaurant.id);
  }, [selectedRestaurant, getMenuCategories]);

  return (
    <Col style={{ marginTop: '20px' }} span={6}>
      <Anchor offsetTop={20}>
        <Title style={{ textAlign: 'center' }} level={5}>
          Categories
        </Title>
        {menuCategories &&
          menuCategories.map((category) => (
            <Link
              key={category.id}
              href={`#category-${category.id}`}
              title={category.name}
            />
          ))}
      </Anchor>
    </Col>
  );
};

export default RestaurantMenuCategoryList;
