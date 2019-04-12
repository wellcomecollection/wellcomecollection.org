// @flow

import { spacing, font, classNames } from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import {
  wellcomeCollectionGallery,
  wellcomeCollectionAddress,
} from '../../../model/organization';

const FindUs = () => (
  <div
    className={classNames({
      [font({ s: 'HNL5' })]: true,
      'find-us': true,
    })}
  >
    <a
      href="https://www.google.co.uk/maps/dir//Wellcome+Collection,+Euston+Road,+London/@51.5258128,-0.136211,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x48761b25f10b008f:0xed51ac6f865b038a!2m2!1d-0.133945!2d51.525851"
      className="find-us__link block"
    >
      <span className="find-us__address">
        <Icon
          name="location"
          extraClasses={`float-l ${spacing(
            { s: 2, m: 2, l: 2, xl: 2 },
            { margin: ['right'] }
          )}`}
        />
        <p
          className={classNames({
            [spacing({ s: 2 }, { margin: ['bottom'] })]: true,
          })}
        >
          <span className="find-us__street">
            {wellcomeCollectionAddress.streetAddress}
          </span>
          <span className="find-us__locality">
            {wellcomeCollectionAddress.addressLocality}
          </span>{' '}
          <span className="find-us__postal-code">
            {wellcomeCollectionAddress.postalCode}
          </span>
          <span className="find-us__country">
            {wellcomeCollectionAddress.addressCountry}
          </span>
        </p>
      </span>
    </a>
    <p
      style={{ marginLeft: '38px' }}
      className={classNames({
        [spacing({ s: 3 }, { margin: ['bottom'] })]: true,
        block: true,
      })}
    >
      <a href="/pages/WwabUiAAAHQXGNHB">Getting here</a>
    </p>
    <p
      style={{ marginLeft: '38px' }}
      className={classNames({
        [spacing({ s: 3 }, { margin: ['bottom'] })]: true,
        block: true,
      })}
    >
      <abbr title="telephone number">T</abbr>:{' '}
      <a
        className="find-us__link"
        href={`tel:${wellcomeCollectionGallery.telephone}`}
      >
        +44 (0)20 7611 2222
      </a>
      <br />
      <abbr title="Email">E</abbr>:{' '}
      <a className="find-us__link" href="mailto:info@wellcomecollection.org">
        info@wellcomecollection.org
      </a>
    </p>
  </div>
);

export default FindUs;
