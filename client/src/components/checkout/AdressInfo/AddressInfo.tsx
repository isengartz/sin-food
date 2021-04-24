import React from 'react';
import { Form, FormInstance, Input } from 'antd';

interface AddressInfoProps {
  full_name?: string;
  floor?: string;
  phone?: string;
}

const AddressInfo = React.forwardRef<FormInstance, AddressInfoProps>(
  ({ full_name, floor, phone }, ref) => {
    return (
      <Form ref={ref} name="address_info_form" layout="vertical">
        <Form.Item
          label="Name in Door's Bell"
          required
          name="bell_name"
          initialValue={full_name || ''}
        >
          <Input />
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
            initialValue={floor || ''}
            name="floor"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            initialValue={phone || ''}
            label="Phone"
            style={{
              display: 'inline-block',
              width: 'calc(50% - 8px)',
              margin: '0 8px',
            }}
          >
            <Input />
          </Form.Item>
        </Input.Group>

        <Form.Item name="comments" label="Address Comments">
          <Input.TextArea placeholder="For example call me instead of using door bell" />
        </Form.Item>
      </Form>
    );
  },
);

export default AddressInfo;
