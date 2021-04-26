import React from 'react';
import { MenuItemInterface } from '../../../../util/interfaces/MenuItemInterface';
import { Typography } from 'antd';
import RestaurantMenuListItem from '../RestaurantMenuListItem/RestaurantMenuLIstItem';
import './RestaurantMenuListWrapper.less';

interface RestaurantMenuListWrapperProps {
  id: string;
  name: string;
  items: MenuItemInterface[];
}

const { Title } = Typography;

/**
 * Renders a list of menu items
 * @param id
 * @param name
 * @param items
 * @constructor
 */
const RestaurantMenuListWrapper: React.FC<RestaurantMenuListWrapperProps> = ({
  id,
  name,
  items,
}) => {
  return (
    <div className="menu-category-items-wrapper" id={`category-${id}`}>
      <Title className="menu-category-items-wrapper__name" level={2}>
        {name}
      </Title>

      <ul className="menu-category-items-wrapper__list">
        {items &&
          items.map((item) => (
            <RestaurantMenuListItem
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              basePrice={item.base_price}
              variations={item.variations || []}
            />
          ))}
      </ul>
    </div>
  );
};

export default RestaurantMenuListWrapper;
