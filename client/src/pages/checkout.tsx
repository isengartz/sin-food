import React, { useEffect, useRef } from 'react';
import {
  Card,
  Col,
  Divider,
  FormInstance,
  Layout,
  Row,
  Typography,
} from 'antd';
import { useTypedSelector } from '../hooks/useTypedSelector';
import {
  selectCartData,
  selectCheckoutIsLoading,
  selectCurrentSelectedAddress,
  selectCurrentUser,
  selectOrderErrors,
  selectSelectedRestaurant,
  selectOrderPaymentMethod,
} from '../state';
import { useActions } from '../hooks/useActions';
import { useHistory } from 'react-router-dom';
import Loader from '../components/layout/Loader/Loader';
import { UserAddress } from '../util/interfaces/UserAddress';
import { UserFullPayload } from '../util/interfaces/UserFullPayload';
import PaymentOptions from '../components/checkout/PaymentOptions/PaymentOptions';
import CompleteCheckout from '../components/checkout/CompleteCheckout/CompleteCheckout';
import AddressInfo from '../components/checkout/AdressInfo/AddressInfo';
import { useErrorMessage } from '../hooks/useErrorMessage';
const { Content } = Layout;

const CheckOutPage: React.FC = () => {
  const history = useHistory();
  const addressInfoForm = useRef<FormInstance>(null);

  const {
    getRestaurant,
    createOrder,
    clearOrderErrors,
    createPayment,
  } = useActions();
  const errors = useTypedSelector(selectOrderErrors);
  const paymentMethod = useTypedSelector(selectOrderPaymentMethod);
  const loading = useTypedSelector(selectCheckoutIsLoading);
  const user = useTypedSelector(selectCurrentUser) as UserFullPayload;
  const cartData = useTypedSelector(selectCartData);
  const restaurant = useTypedSelector(selectSelectedRestaurant);
  const userAddress = useTypedSelector(
    selectCurrentSelectedAddress,
  ) as UserAddress;

  useErrorMessage(errors, clearOrderErrors);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartData) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get Restaurant information
  useEffect(() => {
    if (!restaurant && cartData && cartData.restaurant) {
      getRestaurant(cartData.restaurant);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartData]);

  /**
   * Handles Payment and Order Creation
   * @param token
   */
  const onCheckoutClick = async (token: string = '') => {
    console.log('Checking out...');

    // Build Payload
    const payload = {
      userId: user.id,
      restaurantId: cartData.restaurant,
      menu_items: cartData.items,
      address_info: {
        ...addressInfoForm.current?.getFieldsValue(true),
        full_address: userAddress.full_address,
      },
    };

    // Create a new order
    const order = await createOrder(payload);

    // Try to pay for the order
    if (order) {
      const payment = await createPayment(
        // @ts-ignore
        order.id,
        paymentMethod,
        token || '',
      );

      // Redirect to thank you page
      // @ts-ignore
      if (payment.status! === 'success') {
        //@ts-ignore
        history.push(`/thank-you/${payment.data.payment.orderId}`);
      }
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '0 50px' }}>
        <Row justify="center" gutter={[16, 16]}>
          <Col style={{ marginTop: '30px' }} span={12}>
            <Typography.Text>{restaurant && restaurant.name}</Typography.Text>
            <Typography.Title level={5}>Checkout</Typography.Title>
          </Col>
        </Row>
        <Row justify="center" gutter={[16, 16]}>
          <Col span={4}>
            <Card>
              <Typography.Title level={5}>1. Address</Typography.Title>
              <Typography.Text>
                {userAddress && userAddress.full_address}
              </Typography.Text>
              <Divider />
              {user && userAddress && !loading && (
                <AddressInfo
                  ref={addressInfoForm}
                  floor={userAddress.floor}
                  phone={user.phone}
                  full_name={`${user.first_name} ${user.last_name}`}
                />
              )}
            </Card>
          </Col>
          <Col span={4}>
            <PaymentOptions />
          </Col>

          <Col span={4}>
            <CompleteCheckout onClick={onCheckoutClick} />
          </Col>
        </Row>
      </Content>
      {loading && <Loader />}
    </Layout>
  );
};

export default CheckOutPage;
