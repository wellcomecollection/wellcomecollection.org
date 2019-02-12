import { useEffect, useRef } from 'react';
import GoogleMapsLoader from 'google-maps';
import styled from 'styled-components';
type Props = {|
  title: string,
  latitude: number,
  longitude: number,
|};

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  ${props => props.theme.media.medium`
    padding-top: 56.25%;
  `}
`;

const Map = ({ title, latitude, longitude }: Props) => {
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
      /* eslint-disable-next-line no-unused-vars */
      const marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: title,
      });
    });
    return () => {
      GoogleMapsLoader.release();
    };
  }, []);

  return <MapContainer ref={mapContainer} />;
};

export default Map;
