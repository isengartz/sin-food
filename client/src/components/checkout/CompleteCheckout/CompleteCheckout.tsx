import React from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import {
  selectCartItems,
  selectCartTotalPrice,
  selectOrderPaymentMethod,
} from '../../../state';
import { formatMoney } from '../../../util/formatMoney';
import CartItem from '../../store/Cart/CartItem/CartItem';
import { PaymentMethod } from '@sin-nombre/sinfood-common';
import StripeCheckout from '../StripeCheckout/StripeCheckout';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC_KEY as string,
);

interface CompleteCheckoutProps {
  onClick: () => void;
}

const CompleteCheckout: React.FC<CompleteCheckoutProps> = ({ onClick }) => {
  const cartItems = useTypedSelector(selectCartItems);
  const totalPrice = useTypedSelector(selectCartTotalPrice);
  const paymentMethod = useTypedSelector(selectOrderPaymentMethod);

  return (
    <Card>
      <Space style={{ width: '100%' }} direction="vertical">
        <Typography.Title level={5}>3. Complete Checkout</Typography.Title>
        <Typography.Title level={4}>
          <span style={{ float: 'left' }}>Total:</span>{' '}
          <span style={{ float: 'right' }}>{formatMoney(totalPrice)}</span>
        </Typography.Title>
        <Elements stripe={stripePromise}>
          {paymentMethod && paymentMethod === PaymentMethod.STRIPE && (
            <StripeCheckout />
          )}
        </Elements>
        {paymentMethod && paymentMethod === PaymentMethod.CASH && (
          <div style={{ textAlign: 'center' }}>
            <Button size="large" onClick={onClick} type="primary">
              Complete
            </Button>
          </div>
        )}
      </Space>
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
            withActions={false}
          />
        ))}
    </Card>
  );
};

export default CompleteCheckout;
