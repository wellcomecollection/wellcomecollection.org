import { FunctionComponent, useEffect, useRef } from 'react';
import GoogleMapsLoader from 'google-maps';
import styled from 'styled-components';

export type Props = {
  title: string;
  latitude: number;
  longitude: number;
};

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  ${props => props.theme.media('medium')`
    padding-top: 56.25%;
  `}
`;

const Map: FunctionComponent<Props> = ({
  title,
  latitude,
  longitude,
}: Props) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    GoogleMapsLoader.KEY = 'AIzaSyCcrz-MyrCbbJNrpFpPXxUFl16FFGmOBKs';
    GoogleMapsLoader.VERSION = 'quarterly';
    GoogleMapsLoader.load(google => {
      const mapCanvas = mapContainer.current;
      const latLng = {
        lat: latitude,
        lng: longitude,
      };
      const mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
        },
      };
      const map = new google.maps.Map(mapCanvas, mapOptions);
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: title,
      });
      /* eslint-enable @typescript-eslint/no-unused-vars */
    });
    return () => {
      GoogleMapsLoader.release();
    };
  }, []);

  return <MapContainer data-test-id="map-container" ref={mapContainer} />;
};

export default Map;
