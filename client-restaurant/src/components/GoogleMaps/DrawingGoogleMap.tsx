import React, { useRef, useState } from 'react';
import { GoogleMap, DrawingManager } from '@react-google-maps/api';
import { Button } from 'antd';

interface DrawingGoogleMapProps {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  mapContainerStyle?: React.CSSProperties;
  onPolygonComplete?: (polygon: google.maps.Polygon) => void;
}

const defaultProps: DrawingGoogleMapProps = {
  zoom: 13,
  mapContainerStyle: { height: '400px', width: '100%' },
  center: {
    lat: 39.6406457,
    lng: 22.4258778,
  },
};

const DrawingGoogleMap: React.FC<DrawingGoogleMapProps> = ({
  center,
  zoom,
  mapContainerStyle,
  onPolygonComplete,
}) => {
  const drawerManagerRef = useRef<DrawingManager>(null);
  // @ts-ignore
  const [overlays, setOverlays] = useState<google.maps.Polygon>(null);
  const renderMap = () => {
    // wrapping to a function is useful in case you want to access `window.google`
    // to eg. setup options or create latLng object, it won't be available otherwise
    // feel free to render directly if you don't need that

    const onLoad = (mapInstance: any) => {
      // do something with map Instance
      // console.debug(mapInstance);
    };

    const clearSelection = () => {
      overlays.setMap(null);
      // @ts-ignore
      setOverlays(null);
    };

    function onOverlayComplete(e: google.maps.drawing.OverlayCompleteEvent) {
      // @ts-ignore
      this.setDrawingMode(null);
      setOverlays(e.overlay as google.maps.Polygon);
      // @ts-ignore
      onPolygonComplete(e.overlay as google.maps.Polygon);
    }
    const drawingOptions = {
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
    };
    return (
      <>
        <GoogleMap
          center={center || defaultProps.center}
          zoom={zoom || defaultProps.zoom}
          mapContainerStyle={mapContainerStyle || defaultProps.mapContainerStyle}
          onLoad={onLoad}
        >
          {!overlays && (
            <DrawingManager
              ref={drawerManagerRef}
              options={drawingOptions}
              onOverlayComplete={onOverlayComplete}
            />
          )}
        </GoogleMap>
        <Button onClick={clearSelection} type="primary">
          Clear Polygon
        </Button>
      </>
    );
  };

  return renderMap();
};

export default DrawingGoogleMap;
