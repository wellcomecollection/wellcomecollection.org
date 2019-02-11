/* global google */
import { useEffect, useRef } from 'react';
import GoogleMapsLoader from 'google-maps';
type Props = {|
  title: string,
  latitude: number,
  longitude: number,
|};

const Map = ({ title, latitude, longitude }: Props) => {
  const mapContainer = useRef(null);

  const createMap = () => {
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
  };

  useEffect(() => {
    GoogleMapsLoader.KEY = 'AIzaSyCcrz-MyrCbbJNrpFpPXxUFl16FFGmOBKs';
    GoogleMapsLoader.VERSION = 'quarterly';
    GoogleMapsLoader.load(google => createMap());
  }, []);

  return <div ref={mapContainer} style={{ height: '300px' }} />;
};

export default Map;
