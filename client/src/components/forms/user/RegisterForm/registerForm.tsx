import React, { useEffect } from 'react';
import { useActions } from '../../../../hooks/useActions';
import { useErrorMessage } from '../../../../hooks/useErrorMessage';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { Button, Checkbox, Form, Input, Select, Typography } from 'antd';
import { COUNTRY_CODES } from '../../../../util/constants';
import { selectUser } from '../../../../state';
import { RegisterUserForm } from '../../../../util/interfaces/forms/RegisterUserForm';
import { useHistory } from 'react-router';

const { Option } = Select;

const RegisterForm = () => {
  const { errors, currentUser } = useTypedSelector(selectUser);
  const { registerUser, clearUserErrors } = useActions();
  let history = useHistory();
  // Attach Error Handling for User Errors
  useErrorMessage(errors, clearUserErrors);

  // Redirect on Successful register if user is logged in
  useEffect(() => {
    if (currentUser) {
      history.push('/');
    }
  }, [currentUser, history]);

  // On Submit
  const onSubmit = (values: RegisterUserForm) => {
    const formattedValues = { ...values, phone: values.prefix + values.phone };
    // @ts-ignore
    delete formattedValues.prefix;
    console.log('Received values of form: ', formattedValues);

    const response = registerUser(formattedValues);
    console.info(response);
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
    <Form
      {...formItemLayout}
      onFinish={onSubmit}
      layout="horizontal"
      size="large"
      name="register-user"
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
        rules={[{ required: true, message: 'Please input your phone number!' }]}
      >
        <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
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
  );
};

export default RegisterForm;