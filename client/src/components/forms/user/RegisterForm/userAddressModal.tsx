import React, { useState } from 'react';
import useResetFormOnCloseModal from '../../../../hooks/useResetFormOnCloseModal';
import { Form, Input, Modal, Divider } from 'antd';
import SimpleGoogleMap, {
  GoogleMapMarker,
} from '../../../maps/simpleGoogleMap';
import GooglePlacesAutocomplete, {
  geocodeByAddress,
} from 'react-google-places-autocomplete';
import { useJsApiLoader } from '@react-google-maps/api';
import { handleGeocodingFullAddress } from '../../../../util/handleGeocodingFullAddress';
import { GOOGLE_MAP_ZOOM_VALUE_ON_PIN } from '../../../../util/constants';

interface ModalFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit?: () => void;
}
const libraries: (
  | 'drawing'
  | 'geometry'
  | 'localContext'
  | 'places'
  | 'visualization'
)[] = ['places'];

/**
 * Adds a form for a user to add a new address
 * @param visible
 * @param onCancel
 * @constructor
 */
const UserAddressModal: React.FC<ModalFormProps> = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [markers, setMarkers] = useState<GoogleMapMarker[]>([]);
  const [mapCenter, setMapCenter] = useState<GoogleMapMarker['location']>();
  const [mapZoom, setMapZoom] = useState<number>();

  // Loads the GMAPS API alongside with any given libraries
  useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Reset all form fields on modal close
  useResetFormOnCloseModal({
    form,
    visible,
  });

  const onOk = () => {
    form.submit();
  };

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
  };

  return (
    <Modal title="Address" visible={visible} onOk={onOk} onCancel={onCancel}>
      <Form form={form} layout="vertical" name="userAddressForm">
        <div className="map-wrapper">
          <SimpleGoogleMap
            zoom={mapZoom}
            center={mapCenter}
            markers={markers}
          />
        </div>
        <Divider dashed />
        <Form.Item
          name="full_address"
          label="Full Address"
          rules={[{ required: true }]}
        >
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
          {/*<GeocodingAutoComplete onComplete={onGeocodingDone} />*/}
        </Form.Item>
        <Form.Item name="floor" label="Floor" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input placeholder="Example: House / Work" />
        </Form.Item>
        <Form.Item name="latitude" className="display-none">
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="longitude" className="display-none">
          <Input type="hidden" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserAddressModal;
