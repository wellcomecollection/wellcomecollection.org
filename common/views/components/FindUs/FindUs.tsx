import { FunctionComponent } from 'react';
import styled from 'styled-components';
import {
  wellcomeCollectionGallery,
  wellcomeCollectionAddress,
} from '@weco/common/data/organization';
import Space from '@weco/common/views/components/styled/Space';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { createScreenreaderLabel } from '@weco/common/utils/telephone-numbers';
import PlainList from '../styled/PlainList';

const PlainLink = styled.a`
  transition: color 200ms ease;

  /* TODO change hover behaviour to match the rest of the website? */
  &,
  &:link,
  &:visited {
    text-decoration: none;
    border: none;
  }

  &:hover,
  &:focus {
    color: ${props => props.theme.color('accent.lightGreen')};
  }
`;

const FindUs: FunctionComponent = () => (
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
      <PlainLink
        href={`tel:${wellcomeCollectionGallery.telephone.replace(/\s/g, '')}`}
        aria-label={createScreenreaderLabel(
          wellcomeCollectionGallery.displayTelephone
        )}
      >
        {wellcomeCollectionGallery.displayTelephone}
      </PlainLink>
      <br />
      <a href="mailto:info@wellcomecollection.org">
        info@wellcomecollection.org
      </a>
    </p>
    <PlainList>
      <Space as="li" v={{ size: 's', properties: ['padding-bottom'] }}>
        <a href={`/pages/${prismicPageIds.gettingHere}`}>Getting here</a>
      </Space>
      <Space
        as="li"
        v={{ size: 's', properties: ['padding-top', 'padding-bottom'] }}
      >
        <a href={`/pages/${prismicPageIds.access}`}>Accessibility</a>
      </Space>
    </PlainList>
  </>
);

export default FindUs;
