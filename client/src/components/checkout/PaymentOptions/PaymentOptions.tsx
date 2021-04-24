import React from 'react';
import { Card, Radio, Typography } from 'antd';
import { PaymentMethod } from '@sin-nombre/sinfood-common';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { selectOrderPaymentMethod } from '../../../state';
import { useActions } from '../../../hooks/useActions';

const PaymentOptions: React.FC = () => {
  const selectActivePaymentMethod = useTypedSelector(selectOrderPaymentMethod);
  const { updatePaymentMethod } = useActions();
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  return (
    <Card>
      <Typography.Title level={5}>2. Payment Options</Typography.Title>
      <Radio.Group
        onChange={(e) => updatePaymentMethod(e.target.value)}
        value={selectActivePaymentMethod}
      >
        <Radio value={PaymentMethod.CASH} style={radioStyle}>
          Pay with Cash
        </Radio>
        <Radio style={radioStyle} value={PaymentMethod.STRIPE}>
          Pay with Credit Card
        </Radio>
      </Radio.Group>
    </Card>
  );
};

export default PaymentOptions;
