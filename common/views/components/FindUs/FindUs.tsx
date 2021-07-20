import styled from 'styled-components';
import { font, classNames } from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import {
  wellcomeCollectionGallery,
  wellcomeCollectionAddress,
} from '../../../model/organization';
import Space from '../styled/Space';
import { FunctionComponent } from 'react';

const StyledFindUs = styled.div.attrs({
  className: classNames({
    [font('hnr', 5)]: true,
  }),
})`
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
      color: ${props => props.theme.color('green')};
    }
  }
`;

const FindUs: FunctionComponent = () => (
  <StyledFindUs>
    <Space v={{ size: 'l', properties: ['padding-bottom'] }}>
      <a
        href="https://www.google.co.uk/maps/dir//Wellcome+Collection,+Euston+Road,+London/@51.5258128,-0.136211,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x48761b25f10b008f:0xed51ac6f865b038a!2m2!1d-0.133945!2d51.525851"
        className="plain-link block"
      >
        <span className="flex">
          <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
            <span className="float-l">
              <Icon name="location" />
            </span>
          </Space>
          <Space v={{ size: 'm', properties: ['margin-bottom'] }} as="p">
            <span className="block">
              {wellcomeCollectionAddress.streetAddress}
            </span>
            {wellcomeCollectionAddress.addressLocality}{' '}
            {wellcomeCollectionAddress.postalCode}
            <span className="block">
              {wellcomeCollectionAddress.addressCountry}
            </span>
          </Space>
        </span>
      </a>
      <Space
        v={{
          size: 'm',
          properties: ['margin-bottom'],
        }}
        as="p"
        style={{ marginLeft: '38px' }}
        className={classNames({
          block: true,
        })}
      >
        <a href="/pages/WwabUiAAAHQXGNHB">Getting here</a>
      </Space>
      <p
        style={{ marginLeft: '38px' }}
        className={classNames({
          block: true,
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
    </Space>
  </StyledFindUs>
);

export default FindUs;
