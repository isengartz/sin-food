import React from 'react';
import { Card, Form, FormInstance, Input, Typography } from 'antd';

interface PaymentOptionsProps {
  options?: string[];
  form: FormInstance;
}

// const PaymentOptions = React.forwardRef<FormInstance, PaymentOptionsProps>(
//   (props, ref) => {
//     return (
//       <Card>
//         <Typography.Title level={5}>2. Payment Options</Typography.Title>
//         <Form ref={ref}></Form>
//       </Card>
//     );
//   },
// );

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ form }) => {
  return (
    <Card>
      <Typography.Title level={5}>2. Payment Options</Typography.Title>
      <Form form={form}>
        <Form.Item label="test">
          <Input name="test" />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PaymentOptions;
