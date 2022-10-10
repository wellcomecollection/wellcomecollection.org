import { FC } from 'react';
import styled from 'styled-components';
import {
  wellcomeCollectionGallery,
  wellcomeCollectionAddress,
} from '@weco/common/data/organization';
import Space from '@weco/common/views/components/styled/Space';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';

const PlainLink = styled.a.attrs({ className: 'plain-link' })`
  transition: color 200ms ease;

  &:hover,
  &:focus {
    color: ${props => props.theme.color('accent.lightGreen')};
  }
`;

const FindUs: FC = () => (
  <>
    <Space v={{ size: 'm', properties: ['margin-bottom'] }} as="p">
      <PlainLink href={wellcomeCollectionAddress.addressMap}>
        {wellcomeCollectionAddress.streetAddress}
        <br />
        {wellcomeCollectionAddress.addressLocality}{' '}
        {wellcomeCollectionAddress.postalCode}
      </PlainLink>
    </Space>
    <p>
      <PlainLink href={`tel:${wellcomeCollectionGallery.telephone}`}>
        {wellcomeCollectionGallery.displayTelephone}
      </PlainLink>
      <br />
      <a href="mailto:info@wellcomecollection.org">
        info@wellcomecollection.org
      </a>
    </p>
    <p>
      <a href={`/pages/${prismicPageIds.gettingHere}`}>Getting here</a>
    </p>
  </>
);

export default FindUs;
