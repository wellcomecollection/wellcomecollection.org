import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import {
  wellcomeCollectionAddress,
  wellcomeCollectionGallery,
} from '@weco/common/data/organization';
import { createScreenreaderLabel } from '@weco/common/utils/telephone-numbers';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

const PlainLink = styled.a`
  transition: color 200ms ease;

  /* TODO change hover behaviour to match the rest of the website? */
  &,
  &:link,
  &:visited {
    text-decoration: none;
    border: none;
  }

  &:hover {
    color: ${props => props.theme.color('accent.lightGreen')};
  }
`;

type Props = {
  hideAccessibility?: boolean; // In the footer accessibility has its own column
};

const FindUs: FunctionComponent<Props> = ({ hideAccessibility }) => (
  <>
    <Space $v={{ size: 'm', properties: ['margin-bottom'] }} as="p">
      <PlainLink href={wellcomeCollectionAddress.addressMap}>
        {wellcomeCollectionAddress.streetAddress}
        <br />
        {wellcomeCollectionAddress.addressLocality}{' '}
        {wellcomeCollectionAddress.postalCode}
      </PlainLink>
    </Space>
    <Space as="p" $v={{ size: 'm', properties: ['margin-bottom'] }}>
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
    </Space>
    <PlainList>
      <Space as="li" $v={{ size: 's', properties: ['padding-bottom'] }}>
        <a href={`/visit-us/${prismicPageIds.gettingHere}`}>Getting here</a>
      </Space>
      {!hideAccessibility && (
        <Space
          as="li"
          $v={{ size: 's', properties: ['padding-top', 'padding-bottom'] }}
        >
          <a href={`/visit-us/${prismicPageIds.access}`}>Access information</a>
        </Space>
      )}
    </PlainList>
  </>
);

export default FindUs;
