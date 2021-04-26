import React from 'react';
import { Button, Divider, Typography } from 'antd';
import { formatMoney } from '../../../../util/formatMoney';
import './CartItem.less';
import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { selectMenuItems } from '../../../../state';

interface CartItemProps {
  name: string;
  description: string;
  price: number;
  uuid: string;
  id: string;
  quantity: number;
  withActions: boolean;
}

/**
 * Single cart item.
 * @param name
 * @param description
 * @param price
 * @param uuid
 * @param id
 * @param quantity
 * @param withActions Used to enable disable the click functionality ( for edit )
 * @constructor
 */
const CartItem: React.FC<CartItemProps> = ({
  name,
  description,
  price,
  uuid,
  id,
  quantity,
  withActions = true,
}) => {
  const {
    removeItemFromCart,
    startUpdatingMenuItem,
    showMenuItemModal,
  } = useActions();
  const menuItems = useTypedSelector(selectMenuItems);

  const updateItem = (uuid: string) => {
    const found = menuItems.find((item) => item.id === id);
    console.log(uuid, found);
    startUpdatingMenuItem(found!, uuid);
    showMenuItemModal();
  };

  return (
    <div className="cart-list-item">
      <Divider />
      <Typography.Title className="cart-list-item__name" level={5}>
        {withActions ? (
          <button onClick={(e) => updateItem(uuid)}>{name}</button>
        ) : (
          name
        )}
      </Typography.Title>
      {withActions && (
        <Typography.Text className="cart-list-item__button-close">
          <Button
            onClick={() => removeItemFromCart(uuid)}
            type="dashed"
            shape="circle"
          >
            x
          </Button>
        </Typography.Text>
      )}

      <Typography.Paragraph
        className="cart-list-item__description"
        type="secondary"
      >
        {description}
      </Typography.Paragraph>
      <Typography.Text className="cart-list-item__quantity">
        x{quantity}
      </Typography.Text>
      <Typography.Text className="cart-list-item__price" strong>
        {formatMoney(price)}
      </Typography.Text>
    </div>
  );
};

export default CartItem;
