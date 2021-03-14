import React, { useEffect, useState, useRef } from 'react';
import { useActions } from '../../../../hooks/useActions';
import { useErrorMessage } from '../../../../hooks/useErrorMessage';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { Button, Checkbox, Form, Input, Select, Typography } from 'antd';
import { COUNTRY_CODES } from '../../../../util/constants';
import { selectUser } from '../../../../state';
import {
  RegisterUserAddressForm,
  RegisterUserForm,
} from '../../../../util/interfaces/forms/RegisterUserForm';
import { useHistory } from 'react-router';
import { FrownOutlined } from '@ant-design/icons';
import { UserAddress } from '../../../../util/interfaces/UserAddress';
import UserAddressModal from './userAddressModal';

const { Option } = Select;

const RegisterForm = () => {
  const [visible, setVisible] = useState(false);
  const { errors, currentUser } = useTypedSelector(selectUser);
  const { registerUser, clearUserErrors } = useActions();
  const mainFormRef = useRef<any>();
  let history = useHistory();

  // Attach Error Handling for User Errors
  useErrorMessage(errors, clearUserErrors);

  // Redirect on Successful register /  if user is logged in
  useEffect(() => {
    if (currentUser) {
      history.push('/');
    }
  }, [currentUser, history]);

  const showUserAddressModal = () => {
    setVisible(true);
  };

  const hideUserAddressModal = () => {
    setVisible(false);
  };

  // On Submit
  const onSubmit = (values: RegisterUserForm) => {
    // Format address payload in the appropriate payload
    const addresses = mainFormRef.current
      .getFieldValue('addresses')
      .map((address: RegisterUserAddressForm) => {
        return {
          ...address,
          location: {
            coordinates: [address.longitude, address.latitude],
          },
        };
      });

    // Format the rest of values
    const formattedValues = {
      ...values,
      phone: values.prefix + values.phone,
      addresses,
    };
    // @ts-ignore
    delete formattedValues.prefix;

    registerUser(formattedValues);
  };

  // Form Style
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  // TOS && Submit btn Style
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  // Country phone codes plugin
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 170 }}>
        {COUNTRY_CODES.map((country) => {
          return (
            <Option
              key={country.code}
              value={country.code}
            >{`${country.code} (${country.country})`}</Option>
          );
        })}
      </Select>
    </Form.Item>
  );

  return (
    <Form.Provider
      onFormFinish={(name, { values, forms }) => {
        if (name === 'userAddressForm') {
          const { registerUserForm } = forms;
          const addresses = registerUserForm.getFieldValue('addresses') || [];
          const updatedAddresses = [...addresses, values];
          registerUserForm.setFieldsValue({
            addresses: updatedAddresses,
          });
          setVisible(false);
        }
      }}
    >
      <Form
        ref={mainFormRef}
        {...formItemLayout}
        onFinish={onSubmit}
        layout="horizontal"
        size="large"
        name="registerUserForm"
        scrollToFirstError
        validateTrigger="onSubmit"
        initialValues={{
          prefix: '+30',
        }}
      >
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: 'First name is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: 'Last name is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              min: 8,
              message: 'Password must be at least 8 characters long',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="password_confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  'The two passwords that you entered do not match!',
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: 'Please input your phone number!' },
          ]}
        >
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Address List"
          shouldUpdate={(prevValues, curValues) =>
            prevValues.addresses !== curValues.addresses
          }
        >
          {({ getFieldValue }) => {
            const addresses: UserAddress[] = getFieldValue('addresses') || [];
            return addresses.length ? (
              <ul className="user-address-list">
                {addresses.map((address, index) => (
                  <li key={index} className="address-list-item">
                    {address.full_address}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography.Text className="ant-form-text" type="secondary">
                ( <FrownOutlined /> No Address yet. )
              </Typography.Text>
            );
          }}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button
            htmlType="button"
            style={{ margin: '0 8px' }}
            onClick={showUserAddressModal}
          >
            Add Address
          </Button>
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject('You must agree to the TOS!'),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the{' '}
            <Typography.Link href="/tos" target="_blank">
              agreement
            </Typography.Link>
          </Checkbox>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
      <UserAddressModal visible={visible} onCancel={hideUserAddressModal} />
    </Form.Provider>
  );
};

export default RegisterForm;
