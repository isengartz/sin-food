import React from 'react';
import { useHistory } from 'react-router-dom';
import { Affix, Alert, Button, Col, Empty, Space, Typography } from 'antd';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import {
  selectCartItems,
  selectCartTotalPrice,
  selectCurrentSelectedAddress,
  selectSelectedRestaurant,
} from '../../../state';
import { UserAddress } from '../../../util/interfaces/UserAddress';
import { formatMoney } from '../../../util/formatMoney';
import CartItem from './CartItem/CartItem';
import './cart.less';

/**
 * Shows the items added to cart and total price
 * If the total price of items are lower than the restaurant minimum order price
 * It disables the button. The same goes when no items are added in cart.
 * @constructor
 */
const Cart: React.FC = () => {
  const history = useHistory();
  const userAddress = useTypedSelector(
    selectCurrentSelectedAddress,
  ) as UserAddress;

  const selectedRestaurant = useTypedSelector(selectSelectedRestaurant);
  const cartItems = useTypedSelector(selectCartItems);
  const cartTotalCost = useTypedSelector(selectCartTotalPrice);

  const isButtonEnabled =
    cartItems.length > 0 &&
    selectedRestaurant &&
    cartTotalCost >= selectedRestaurant!.minimum_order;

  return (
    <Col style={{ marginTop: '20px' }} span={6}>
      <Affix offsetTop={20}>
        <div className="cart-module">
          <Space direction="vertical">
            <Typography.Title className="cart-module__title" level={5}>
              Your Cart
            </Typography.Title>
            <Typography.Text>{userAddress.full_address! || ''}</Typography.Text>
            {cartItems.length > 0 &&
              selectedRestaurant &&
              cartTotalCost < selectedRestaurant!.minimum_order && (
                <Alert
                  message={`You are missing ${formatMoney(
                    selectedRestaurant!.minimum_order - cartTotalCost,
                  )} for the minimum order!`}
                  type="warning"
                  showIcon
                />
              )}

            {cartItems.length === 0 && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Cart is empty"
              />
            )}
            {cartItems &&
              cartItems.length > 0 &&
              cartItems.map((item) => (
                <CartItem
                  key={item.uuid}
                  name={item.item_options.name}
                  description={item.item_options.description}
                  price={item.item_options.price}
                  uuid={item.uuid}
                  id={item.item}
                  quantity={item.item_options.quantity}
                  withActions
                />
              ))}
            <Typography.Title level={5}>
              Total: {formatMoney(cartTotalCost)}
            </Typography.Title>
            <Button
              onClick={() => history.push('/checkout')}
              type="primary"
              disabled={!isButtonEnabled}
            >
              Continue
            </Button>
          </Space>
        </div>
      </Affix>
    </Col>
  );
};

export default Cart;
