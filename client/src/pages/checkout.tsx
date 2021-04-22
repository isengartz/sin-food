import React, { useEffect, useRef } from 'react';
import {
  Card,
  Col,
  Divider,
  Form,
  FormInstance,
  Input,
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
  selectSelectedRestaurant,
} from '../state';
import { useActions } from '../hooks/useActions';
import { useHistory } from 'react-router-dom';
import Loader from '../components/layout/Loader/Loader';
import { UserAddress } from '../util/interfaces/UserAddress';
import { UserFullPayload } from '../util/interfaces/UserFullPayload';
import PaymentOptions from '../components/checkout/PaymentOptions/PaymentOptions';
import CompleteCheckout from '../components/checkout/CompleteCheckout/CompleteCheckout';

const { Content } = Layout;

const CheckOutPage: React.FC = () => {
  const history = useHistory();
  const [addressInfoForm] = Form.useForm();
  const [paymentOptionForm] = Form.useForm();

  const { getRestaurant, getCurrentUserFullPayload } = useActions();
  const loading = useTypedSelector(selectCheckoutIsLoading);
  const user = useTypedSelector(selectCurrentUser) as UserFullPayload;
  const cartData = useTypedSelector(selectCartData);
  const restaurant = useTypedSelector(selectSelectedRestaurant);
  const userAddress = useTypedSelector(
    selectCurrentSelectedAddress,
  ) as UserAddress;

  // Redirect if cart is empty
  useEffect(() => {
    getCurrentUserFullPayload(user!.id);
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

  console.log(cartData, restaurant);
  console.log(userAddress);
  console.log(user);

  const onCheckoutClick = () => {
    console.log('Checking out...');
    console.log(addressInfoForm.getFieldsValue(true));
    console.log(addressInfoForm.getFieldsValue(['phone']));
    console.log(paymentOptionForm.getFieldsValue(true));
    // addressInfoRef.current!.submit();
    // const instance = addressInfoRef.current!.getFieldInstance();
  };

  const onFormSubmit = (values: any) => {
    console.log(values);
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
              <Form
                form={addressInfoForm}
                name="address_info_form"
                layout="vertical"
              >
                <Form.Item label="Name in Door's Bell" required>
                  <Input
                    name="bell_name"
                    value={
                      user && user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : ''
                    }
                  />
                </Form.Item>
                <Input.Group>
                  <Form.Item
                    wrapperCol={{ span: 12 }}
                    labelCol={{ span: 12 }}
                    label="Floor"
                    required
                    style={{
                      display: 'inline-block',
                      width: 'calc(50% - 8px)',
                    }}
                  >
                    <Input
                      name="floor"
                      value={userAddress ? userAddress.floor : ''}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Phone"
                    style={{
                      display: 'inline-block',
                      width: 'calc(50% - 8px)',
                      margin: '0 8px',
                    }}
                  >
                    <Input
                      name="phone"
                      value={user && user.phone ? user.phone : ''}
                    />
                  </Form.Item>
                </Input.Group>

                <Form.Item label="Address Comments">
                  <Input.TextArea
                    name="comments"
                    placeholder="For example call me instead of using door bell"
                  />
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={4}>
            <PaymentOptions form={paymentOptionForm} />
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
