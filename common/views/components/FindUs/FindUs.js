// @flow

import styled from 'styled-components';
import { spacing, font, classNames } from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import {
  wellcomeCollectionGallery,
  wellcomeCollectionAddress,
} from '../../../model/organization';
import VerticalSpace from '../styled/VerticalSpace';

const StyledFindUs = styled.div.attrs(props => ({
  className: classNames({
    [font({ s: 'HNL5' })]: true,
  }),
}))`
  border-bottom: 1px solid ${props => props.theme.colors.charcoal};

  ${props => props.theme.media.medium`
    border-bottom: 0;
  `}

  &:hover,
  &:focus {
    .icon {
      animation-duration: 400ms;
      animation-name: ${props => {
        return props.theme.keyframes.hoverBounce;
      }};
    }
  }

  .plain-link {
    text-decoration: none;
    transition: color 200ms ease;

    &:hover,
    &:focus {
      color: ${props => props.theme.colors.green};
    }
  }
`;

const FindUs = () => (
  <StyledFindUs>
    <VerticalSpace size="l" properties={['padding-bottom']}>
      <a
        href="https://www.google.co.uk/maps/dir//Wellcome+Collection,+Euston+Road,+London/@51.5258128,-0.136211,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x48761b25f10b008f:0xed51ac6f865b038a!2m2!1d-0.133945!2d51.525851"
        className="plain-link block"
      >
        <span className="flex">
          <Icon
            name="location"
            extraClasses={`float-l ${spacing(
              { s: 2, m: 2, l: 2, xl: 2 },
              { margin: ['right'] }
            )}`}
          />
          <VerticalSpace size="m" as="p">
            <span className="block">
              {wellcomeCollectionAddress.streetAddress}
            </span>
            {wellcomeCollectionAddress.addressLocality}{' '}
            {wellcomeCollectionAddress.postalCode}
            <span className="block">
              {wellcomeCollectionAddress.addressCountry}
            </span>
          </VerticalSpace>
        </span>
      </a>
      <VerticalSpace
        as="p"
        size="m"
        style={{ marginLeft: '38px' }}
        className={classNames({
          block: true,
        })}
      >
        <a href="/pages/WwabUiAAAHQXGNHB">Getting here</a>
      </VerticalSpace>
      <p
        style={{ marginLeft: '38px' }}
        className={classNames({
          'block no-margin': true,
        })}
      >
        <abbr title="telephone number">T</abbr>:{' '}
        <a
          className="plain-link"
          href={`tel:${wellcomeCollectionGallery.telephone}`}
        >
          +44 (0)20 7611 2222
        </a>
        <br />
        <abbr title="Email">E</abbr>:{' '}
        <a className="plain-link" href="mailto:info@wellcomecollection.org">
          info@wellcomecollection.org
        </a>
      </p>
    </VerticalSpace>
  </StyledFindUs>
);

export default FindUs;
