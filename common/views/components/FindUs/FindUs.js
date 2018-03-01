// @flow

import {spacing, font} from '../../../utils/classnames';
import {convertImageUri} from '../../../utils/convert-image-uri';
import Icon from '../Icon/Icon';

type Props = {|
  streetAddress: string,
  addressLocality: string,
  postalCode: string,
  addressCountry: string
|}

const baseUrl = 'https://prismic-io.s3.amazonaws.com/wellcomecollection/7a5b0931-e8b0-4568-8f46-9cb3f430bdb9_map.png';
const imageSizes = [563, 425, 282, 600];
const dataSrcset = imageSizes.reduce((acc, size, index) => {
  return `${acc}${index > 0 ? ', ' : ''}${convertImageUri(baseUrl, size)} ${size}w`;
}, '');

const FindUs = ({streetAddress, addressLocality, postalCode, addressCountry}: Props) => (
  <div className={`find-us ${font({s: 'HNL5'})}`}>
    <a href='https://www.google.co.uk/maps/dir//Wellcome+Collection,+Euston+Road,+London/@51.5258128,-0.136211,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x48761b25f10b008f:0xed51ac6f865b038a!2m2!1d-0.133945!2d51.525851' className="find-us__link">
      <span className="find-us__address">
        <Icon name="location" extraClasses={`float-l ${spacing({s: 2, m: 2, l: 2, xl: 2}, {margin: ['right']})}`} />
        <p>
          <span className="find-us__street">{streetAddress}</span>
          <span className="find-us__locality">{addressLocality}</span>
          <span className="find-us__postal-code">{postalCode}</span>
          <span className="find-us__country">{addressCountry}</span>
        </p>
      </span>

      <div className="find-us__map-container">
        <noscript>
          <img width="282" height="282" className="image" src={convertImageUri(baseUrl, 282)}
            alt="Street map showing Wellcome Collection's location" />
        </noscript>
        <img className="find-us__map lazy-image lazyload"
          src={convertImageUri(baseUrl, 282)}
          data-srcset={dataSrcset}
          sizes="(min-width: 1420px) 282px, (min-width: 960px) calc(21.36vw - 17px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)"
          alt="Directions to Wellcome Collection" />
      </div>
    </a>

    <div className="find-us__mapbox">
      <a href="http://mapbox.com/about/maps" className="find-us__mapbox-wordmark">Mapbox</a>
      <div className={`find-us__mapbox-attribution-container ${font({s: 'HNL7'})}`}>
        <a className="find-us__mapbox-credit-link find-us__mapbox-credit-link--first" href="https://www.mapbox.com/map-feedback/">© Mapbox | </a>
        <a className="find-us__mapbox-credit-link" href="http://www.openstreetmap.org/copyright">© OpenStreetMap | </a>
        <a className="find-us__mapbox-credit-link" href="https://www.mapbox.com/map-feedback/"><strong>Improve this map</strong></a>
      </div>
    </div>
  </div>
);

export default FindUs;
