import React from 'react';
import { Divider, Space, Typography } from 'antd';
import { VariationInterface } from '../../../../util/interfaces/MenuItemInterface';
import { formatMoney } from '../../../../util/formatMoney';

interface RestaurantMenuListItemProps {
  id: string;
  name: string;
  basePrice: number;
  description?: string;
  variations?: VariationInterface[];
}
const { Title, Text } = Typography;
const RestaurantMenuListItem: React.FC<RestaurantMenuListItemProps> = ({
  id,
  name,
  description,
  variations,
  basePrice,
}) => {
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
    console.log(id);
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
