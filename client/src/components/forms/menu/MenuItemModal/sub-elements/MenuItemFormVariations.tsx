import React from 'react';
import { MenuItemInterface } from '../../../../../util/interfaces/MenuItemInterface';
import { Col, Radio, RadioChangeEvent, Typography } from 'antd';
import { formatMoney } from '../../../../../util/formatMoney';

interface MenuItemFormVariationsProps {
  variations: MenuItemInterface['variations'];
  selectedItem: string;
  value: string;
  onChange?: (val: string) => void;
  name: string;
}

/**
 * Render a list of variations as Radio Buttons
 * @param variations
 * @param selectedItem
 * @param value
 * @param onChange
 * @param name
 * @constructor
 */
const MenuItemFormVariations: React.FC<MenuItemFormVariationsProps> = ({
  variations,
  selectedItem,
  value,
  onChange,
  name,
}) => {
  const onValueChange = (e: RadioChangeEvent) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return variations && variations.length > 0 ? (
    <Col span={24}>
      <Typography.Title level={3}>Variations</Typography.Title>
      <Radio.Group
        name={name}
        onChange={onValueChange}
        defaultValue={selectedItem}
        value={value}
      >
        {variations.map((variation) => (
          <Radio key={variation.name} value={variation.name}>
            {variation.name} -
            <Typography.Text> {formatMoney(variation.price)}</Typography.Text>
          </Radio>
        ))}
      </Radio.Group>
    </Col>
  ) : null;
};

export default MenuItemFormVariations;
