import React from 'react';
import { Divider, Space, Typography } from 'antd';
import { VariationInterface } from '../../../../util/interfaces/MenuItemInterface';
import { formatMoney } from '../../../../util/formatMoney';
import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { selectMenuItems } from '../../../../state';

interface RestaurantMenuListItemProps {
  id: string;
  name: string;
  basePrice: number;
  description?: string;
  variations?: VariationInterface[];
}
const { Title, Text } = Typography;

/**
 * Single Menu item
 * @param id
 * @param name
 * @param description
 * @param variations
 * @param basePrice
 * @constructor
 */
const RestaurantMenuListItem: React.FC<RestaurantMenuListItemProps> = ({
  id,
  name,
  description,
  variations,
  basePrice,
}) => {
  const { setSelectedMenuItem, showMenuItemModal } = useActions();
  const menuItems = useTypedSelector(selectMenuItems);
  // if we have variations find the lowest price from variations
  // Else just use the basePrice
  const itemPrice =
    variations && variations.length > 0
      ? variations.reduce((acc, cur) => {
          return cur.price < acc ? cur.price : acc;
        }, variations[0].price)
      : basePrice;
  const itemPrefix = variations && variations.length > 0 ? 'From ' : '';

  const onItemClick = (id: string) => {
    const found = menuItems.find((item) => item.id === id);
    if (found) {
      setSelectedMenuItem(found);
      showMenuItemModal();
    } else {
      // this should never ever happen tho xD
      // @todo: add a set_menu_error action and dispatch that instead xD
      alert('Something went really wrong mate xD');
    }
  };

  return (
    <li onClick={() => onItemClick(id)}>
      <Space direction="vertical">
        <Title level={3}>{name}</Title>
        {description && <Text type="secondary">{description}</Text>}
        <Text>
          {itemPrefix}
          {formatMoney(itemPrice)}
        </Text>
      </Space>
      <Divider />
    </li>
  );
};

export default RestaurantMenuListItem;
