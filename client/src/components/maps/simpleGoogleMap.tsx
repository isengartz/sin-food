import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

interface SimpleGoogleMapProps {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  mapContainerStyle?: React.CSSProperties;
  markers?: GoogleMapMarker[];
}

export interface GoogleMapMarker {
  location: {
    lat: number;
    lng: number;
  };
  markerContent?: JSX.Element;
}

const defaultProps: SimpleGoogleMapProps = {
  zoom: 7,
  mapContainerStyle: { height: '400px', width: '100%' },
  center: {
    lat: 39.6406457,
    lng: 22.4258778,
  },
};

const SimpleGoogleMap: React.FC<SimpleGoogleMapProps> = ({
  center,
  zoom,
  mapContainerStyle,
  markers,
}) => {
  const renderMap = () => {
    // wrapping to a function is useful in case you want to access `window.google`
    // to eg. setup options or create latLng object, it won't be available otherwise
    // feel free to render directly if you don't need that

    const onLoad = (mapInstance: any) => {
      // do something with map Instance
      // console.debug(mapInstance);
    };

    return (
      <GoogleMap
        center={center || defaultProps.center}
        zoom={zoom || defaultProps.zoom}
        mapContainerStyle={mapContainerStyle || defaultProps.mapContainerStyle}
        onLoad={onLoad}
      >
        {markers &&
          markers.map((marker, index) => {
            return <Marker position={marker.location} key={index} />;
          })}
      </GoogleMap>
    );
  };

  return renderMap();
};

export default SimpleGoogleMap;
