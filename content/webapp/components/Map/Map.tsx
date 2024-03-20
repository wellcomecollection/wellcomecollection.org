import { FunctionComponent, useEffect, useRef } from 'react';
import { Loader, LoaderOptions } from 'google-maps';
import styled from 'styled-components';

export type Props = {
  title: string;
  latitude: number;
  longitude: number;
};

const options: LoaderOptions = {
  version: 'quartely',
};
const loader = new Loader('AIzaSyCcrz-MyrCbbJNrpFpPXxUFl16FFGmOBKs', options);

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
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window) return;

    loader.load().then(google => {
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
      const map = new google.maps.Map(mapCanvas as Element, mapOptions);
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const marker = new google.maps.Marker({
        position: latLng,
        map,
        title,
      });
      /* eslint-enable @typescript-eslint/no-unused-vars */
    });
    return () => {
      /**
       * not entirely pleased with this, but this is the solution presented in
       * the github issue answer:
       * https://github.com/davidkudera/google-maps-loader/issues/93#issuecomment-1156580846
       */

      if (window.google?.maps) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete google.maps;

        document.querySelectorAll('script').forEach(script => {
          if (
            script.src.includes('googleapis.com/maps') ||
            script.src.includes('maps.gstatic.com') ||
            script.src.includes('earthbuilder.googleapis.com')
          ) {
            script.remove();
          }
        });
      }
    };
  }, []);

  return <MapContainer ref={mapContainer} />;
};

export default Map;
