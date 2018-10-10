// @flow

import {spacing, font, classNames} from '../../../utils/classnames';
import {convertImageUri} from '../../../utils/convert-image-uri';
import Icon from '../Icon/Icon';
import {wellcomeCollection, wellcomeCollectionAddress} from '../../../model/organization';

const baseUrl = 'https://prismic-io.s3.amazonaws.com/wellcomecollection/7a5b0931-e8b0-4568-8f46-9cb3f430bdb9_map.png';
const imageSizes = [563, 425, 282, 600];
const dataSrcset = imageSizes.reduce((acc, size, index) => {
  return `${acc}${index > 0 ? ', ' : ''}${convertImageUri(baseUrl, size)} ${size}w`;
}, '');

const FindUs = () => (
  <div className={`find-us ${font({s: 'HNL5'})}`}>
    <a href='https://www.google.co.uk/maps/dir//Wellcome+Collection,+Euston+Road,+London/@51.5258128,-0.136211,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x48761b25f10b008f:0xed51ac6f865b038a!2m2!1d-0.133945!2d51.525851' className='find-us__link block'>
      <span className='find-us__address'>
        <Icon name='location' extraClasses={`float-l ${spacing({s: 2, m: 2, l: 2, xl: 2}, {margin: ['right']})}`} />
        <p>
          <span className='find-us__street'>{wellcomeCollectionAddress.streetAddress}</span>
          <span className='find-us__locality'>{wellcomeCollectionAddress.addressLocality}</span>{' '}
          <span className='find-us__postal-code'>{wellcomeCollectionAddress.postalCode}</span>
          <span className='find-us__country'>{wellcomeCollectionAddress.addressCountry}</span>
        </p>
      </span>
    </a>
    <p style={{marginLeft: '38px'}} className={classNames({
      [spacing({ s: 3 }, {margin: ['bottom']})]: true,
      'block': true
    })}><abrr title='telephone number'>T</abrr>: <a className='find-us__link' href={`tel:${wellcomeCollection.telephone}`}>+44 (0)20 7611 2222</a></p>

    <a href='https://www.google.co.uk/maps/dir//Wellcome+Collection,+Euston+Road,+London/@51.5258128,-0.136211,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x48761b25f10b008f:0xed51ac6f865b038a!2m2!1d-0.133945!2d51.525851' className='find-us__link block'>
      <div className='find-us__map-container'>
        <noscript dangerouslySetInnerHTML={{__html: `
          <img width='282' height='282' className='image' src=${convertImageUri(baseUrl, 282)}
            alt='Street map showing Wellcome Collection's location' />
        `}} />
        <img className='find-us__map lazy-image lazyload'
          src={convertImageUri(baseUrl, 282)}
          data-srcset={dataSrcset}
          sizes='(min-width: 1420px) 282px, (min-width: 960px) calc(21.36vw - 17px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)'
          alt='Directions to Wellcome Collection' />
      </div>
    </a>

    <div className='find-us__mapbox'>
      <a href='http://mapbox.com/about/maps' className='find-us__mapbox-wordmark'>Mapbox</a>
      <div className={`find-us__mapbox-attribution-container ${font({s: 'HNL7'})}`}>
        <a className='find-us__mapbox-credit-link find-us__mapbox-credit-link--first' href='https://www.mapbox.com/map-feedback/'>© Mapbox | </a>
        <a className='find-us__mapbox-credit-link' href='http://www.openstreetmap.org/copyright'>© OpenStreetMap | </a>
        <a className='find-us__mapbox-credit-link' href='https://www.mapbox.com/map-feedback/'><strong>Improve this map</strong></a>
      </div>
    </div>
  </div>
);

export default FindUs;
