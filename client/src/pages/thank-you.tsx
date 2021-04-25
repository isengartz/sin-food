import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Layout, Result } from 'antd';
import { useActions } from '../hooks/useActions';

const { Content } = Layout;
const ThankYouPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const history = useHistory();
  const { clearCartData } = useActions();

  // Remove the cart data
  useEffect(() => {
    clearCartData();
  }, [clearCartData]);

  return (
    <Layout>
      <Content style={{ padding: '0 50px' }}>
        <Result
          className="full-center"
          status="success"
          title="Your order is completed"
          subTitle={`Order number: ${orderId} . Your order is now getting prepared and coming to your way !`}
          extra={[
            <Button onClick={() => history.push('/')} key="buy">
              Buy Again
            </Button>,
          ]}
        />
      </Content>
    </Layout>
  );
};

export default ThankYouPage;
