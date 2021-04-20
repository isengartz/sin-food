import React from 'react';
import { Button, Divider, Typography } from 'antd';
import { formatMoney } from '../../../../util/formatMoney';
import './CartItem.less';
import { useActions } from '../../../../hooks/useActions';

interface CartItemProps {
  name: string;
  description: string;
  price: number;
  id: string;
}

const CartItem: React.FC<CartItemProps> = ({
  name,
  description,
  price,
  id,
}) => {
  const { removeItemFromCart } = useActions();

  return (
    <div className="cart-list-item">
      <Divider />
      <Typography.Title className="cart-list-item__name" level={5}>
        {name}
      </Typography.Title>
      <Typography.Text className="cart-list-item__button-close">
        <Button
          onClick={() => removeItemFromCart(id)}
          type="dashed"
          shape="circle"
        >
          x
        </Button>
      </Typography.Text>
      <Typography.Paragraph
        className="cart-list-item__description"
        type="secondary"
      >
        {description}
      </Typography.Paragraph>
      <Typography.Text className="cart-list-item__price" strong>
        {formatMoney(price)}
      </Typography.Text>
    </div>
  );
};

export default CartItem;
