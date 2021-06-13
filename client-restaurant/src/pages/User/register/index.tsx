import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { Dispatch, StateType } from '@@/plugin-dva/connect';
import SimpleGoogleMap, { GoogleMapMarker } from '@/components/GoogleMaps/simpleGoogleMap';
import { handleGeocodingFullAddress } from '@/utils/handleGeocodingFullAddress';
import { GOOGLE_MAP_ZOOM_VALUE_ON_PIN } from '../../../../config/constants';
import GooglePlacesAutocomplete, { geocodeByAddress } from 'react-google-places-autocomplete';
import { useJsApiLoader } from '@react-google-maps/api';
import { Button, DatePicker, Form, Input, InputNumber, Select, Space } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Weekdays } from '@sin-nombre/sinfood-common';
import TimePicker from '@ant-design/pro-form/lib/components/TimePicker';
import DrawingGoogleMap from '@/components/GoogleMaps/DrawingGoogleMap';
import { adaptWorkingHours } from '@/utils/adaptWorkingHours';
import moment, { Moment } from 'moment';
import { RestaurantCategory } from '@/models/restaurant-categories';

export type RegisterProps = {
  dispatch: Dispatch;
  userRegister: StateType;
  restaurant_categories: RestaurantCategory[];
  submitting?: boolean;
};

const weekdaysPayload = [
  { label: 'Monday', value: Weekdays.Monday },
  { label: 'Tuesday', value: Weekdays.Tuesday },
  { label: 'Wednesday', value: Weekdays.Wednesday },
  { label: 'Thursday', value: Weekdays.Thursday },
  { label: 'Friday', value: Weekdays.Friday },
  { label: 'Saturday', value: Weekdays.Saturday },
  { label: 'Sunday', value: Weekdays.Sunday },
];

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
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const Register: React.FC<RegisterProps> = ({
  dispatch,
  userRegister,
  restaurant_categories,
  submitting,
}) => {
  const [form] = Form.useForm();
  const [markers, setMarkers] = useState<GoogleMapMarker[]>([]);
  const [mapCenter, setMapCenter] = useState<GoogleMapMarker['location']>();
  const [mapZoom, setMapZoom] = useState<number>();

  /**
   * Get restaurant Categories
   */
  useEffect(() => {
    dispatch({
      type: 'restaurant_categories/getAll',
    });
  }, []);

  const libraries: ('drawing' | 'geometry' | 'localContext' | 'places' | 'visualization')[] = [
    'places',
    'drawing',
  ];
  // Loads the GMAPS API alongside with any given libraries
  const { isLoaded } = useJsApiLoader({
    // @ts-ignore
    googleMapsApiKey: REACT_APP_GMAPS_API_KEY || '',
    libraries,
  });

  /**
   * When user clicks on an address from the typehead results
   * @param option
   */
  const onGooglePlaceSelect = async (option: any) => {
    // Geocode the place
    const geocoded = await geocodeByAddress(option.label);

    // Update the Full Address / lat&lng
    form.setFieldsValue({
      full_address: handleGeocodingFullAddress(geocoded[0]),
      longitude: geocoded[0].geometry.location.lng(),
      latitude: geocoded[0].geometry.location.lat(),
    });

    // Re-render the Map with Pin and Zoomed in
    setMapCenter({
      lat: geocoded[0].geometry.location.lat(),
      lng: geocoded[0].geometry.location.lng(),
    });
    setMapZoom(GOOGLE_MAP_ZOOM_VALUE_ON_PIN);
    setMarkers([
      {
        location: {
          lat: geocoded[0].geometry.location.lat(),
          lng: geocoded[0].geometry.location.lng(),
        },
      },
    ]);

    form.setFieldsValue({
      location: {
        coordinates: [geocoded[0].geometry.location.lng(), geocoded[0].geometry.location.lat()],
      },
    });

    console.log(form.getFieldsValue());
  };

  const onPolygonSelect = (polygon: google.maps.Polygon) => {
    const vertices = polygon.getPath();
    const coordinates = [];
    for (let i = 0; i < vertices.getLength(); i++) {
      const xy = vertices.getAt(i);
      coordinates.push([xy.lng(), xy.lat()]);
      console.log(xy.lng(), xy.lat());
    }
    console.log(coordinates);
    form.setFieldsValue({ delivers_to: { coordinates: [coordinates] } });
    console.log(form.getFieldsValue());
  };

  const onFormSubmit = (values: any) => {
    console.log(values);
    console.log(adaptWorkingHours(values.working_hours));
    dispatch({
      type: 'register/register',
      payload: {
        ...values,
        working_hours: adaptWorkingHours(values.working_hours),
        holidays: values.holidays
          ? values.holidays.map((holiday: { date: Moment }) =>
              moment(holiday.date).format('YYYY-MM-DD'),
            )
          : [],
      },
    });
  };

  return (
    <div className={styles.main}>
      <h2>Register Page</h2>
      <Form {...formItemLayout} form={form} onFinish={onFormSubmit}>
        <Form.Item
          name="name"
          label="Restaurant Name"
          rules={[
            {
              required: true,
              message: 'Please input your Restaurant Name',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="categories" label="Restaurant Categories" rules={[{ required: true }]}>
          <Select
            mode="multiple"
            placeholder="Select all the categories your restaurant matches"
            style={{ width: '100%' }}
          >
            {restaurant_categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
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
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="password_confirm"
          label="Confirm Password"
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
                  new Error('The two passwords that you entered do not match!'),
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
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Short restaurant description">
          <TextArea />
        </Form.Item>

        <Form.Item name="minimum_order" label="Minimum Order">
          <InputNumber defaultValue="1" min="0" step="0.5" />
        </Form.Item>

        {isLoaded && (
          <>
            <Form.Item label="Address Map">
              <SimpleGoogleMap zoom={mapZoom} center={mapCenter} markers={markers} />
            </Form.Item>
            <Form.Item name="full_address" label="Full Address" rules={[{ required: true }]}>
              <GooglePlacesAutocomplete
                debounce={750}
                autocompletionRequest={{
                  types: ['address'],
                }}
                selectProps={{
                  onChange: onGooglePlaceSelect,
                  placeholder: 'Type in your address',
                }}
              />
            </Form.Item>
            <div style={{ display: 'none' }}>
              <Form.Item name="latitude" className="display-none">
                <Input type="hidden" />
              </Form.Item>
              <Form.Item name="longitude" className="display-none">
                <Input type="hidden" />
              </Form.Item>
              <Form.Item name="location" className="display-none">
                <Input type="hidden" />
              </Form.Item>
            </div>
          </>
        )}
        <Form.Item label="Holidays">
          <Form.List name="holidays">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      {...formItemLayoutWithOutLabel}
                      name={[name, 'date']}
                      fieldKey={[fieldKey, 'date']}
                      rules={[{ required: true, message: 'Please add a new date' }]}
                    >
                      <DatePicker picker="date" format="YYYY-MM-DD" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item label="Working Hours">
          <Form.List name="working_hours">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline">
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.working_hours !== curValues.working_hours
                      }
                    >
                      {() => (
                        <Form.Item
                          {...field}
                          label="Day"
                          name={[field.name, 'day']}
                          fieldKey={[field.fieldKey, 'day']}
                          rules={[{ required: true, message: 'Missing Day' }]}
                        >
                          <Select style={{ width: 130 }}>
                            {weekdaysPayload.map((item) => (
                              <Select.Option key={item.value} value={item.value}>
                                {item.label}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Time"
                      name={[field.name, 'time']}
                      fieldKey={[field.fieldKey, 'time']}
                      rules={[{ required: true, message: 'Time' }]}
                    >
                      <TimePicker.RangePicker name={[field.name, 'time']} />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Working Hour
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        {isLoaded && (
          <Form.Item name="delivers_to" label="Delivers to">
            <DrawingGoogleMap
              onPolygonComplete={onPolygonSelect}
              zoom={mapZoom}
              center={mapCenter}
            />
          </Form.Item>
        )}
        <Form.Item style={{ textAlign: 'center' }} {...formItemLayoutWithOutLabel}>
          <Button disabled={submitting} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(({ register, restaurant_categories, loading }: ConnectState) => ({
  userRegister: register,
  restaurant_categories: restaurant_categories?.categories || [],
  submitting: loading.effects['register/register'],
}))(Register);
