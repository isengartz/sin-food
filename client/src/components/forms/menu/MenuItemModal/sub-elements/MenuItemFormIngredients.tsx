import { Checkbox, Col, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { formatMoney } from '../../../../../util/formatMoney';

interface MenuItemFormIngredientsProps {
  header: string;
  items: { id: string; name: string; defaultPrice: number }[];
  selectedItems?: string[];
  inputName: string;
  value: string[];
  onChange?: (checkedValue: CheckboxValueType[]) => void;
  showPrices?: boolean;
}

const MenuItemFormIngredients: React.FC<MenuItemFormIngredientsProps> = ({
  header,
  items,
  selectedItems = [],
  inputName,
  onChange,
  value,
  showPrices = true,
}) => {
  const [formattedItems, setFormattedItems] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const formattedArr = items.map((item) => ({
      label: showPrices
        ? `${item.name} - ${formatMoney(item.defaultPrice)}`
        : item.name,
      value: item.id,
    }));
    setFormattedItems(formattedArr);
  }, [items, showPrices]);

  return items && items.length > 0 ? (
    <Col span={24}>
      <Typography.Title level={3}>{header}</Typography.Title>
      <Checkbox.Group
        value={value}
        name={inputName}
        options={formattedItems}
        defaultValue={selectedItems}
        onChange={onChange}
      />
    </Col>
  ) : null;
};

export default MenuItemFormIngredients;
