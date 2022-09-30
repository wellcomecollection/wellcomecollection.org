import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import {
  wellcomeCollectionGallery,
  wellcomeCollectionAddress,
} from '@weco/common/data/organization';
import Space from '@weco/common/views/components/styled/Space';
import { FunctionComponent } from 'react';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';

// TODO mismatched links, what do
const StyledFindUs = styled(Space).attrs({
  className: font('intr', 5),
  v: { size: 'xl', properties: ['padding-bottom'] },
})`
  flex: 1 1 20%;

  .plain-link {
    transition: color 200ms ease;

    &:hover,
    &:focus {
      color: ${props => props.theme.color('accent.green')};
    }
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

const FindUs: FunctionComponent = () => (
  <StyledFindUs>
    <a href={wellcomeCollectionAddress.addressMap} className="plain-link block">
      <Space v={{ size: 'm', properties: ['margin-bottom'] }} as="p">
        <span className="block">{wellcomeCollectionAddress.streetAddress}</span>
        {wellcomeCollectionAddress.addressLocality}{' '}
        {wellcomeCollectionAddress.postalCode}
        <span className="block">
          {wellcomeCollectionAddress.addressCountry}
        </span>
      </Space>
    </a>
    <p>
      <a
        className="plain-link"
        href={`tel:${wellcomeCollectionGallery.telephone}`}
      >
        {wellcomeCollectionGallery.displayTelephone}
      </a>
      <br />
      <a href="mailto:info@wellcomecollection.org">
        info@wellcomecollection.org
      </a>
    </p>
    <p>
      <a href={`/pages/${prismicPageIds.gettingHere}`}>Getting here</a>
    </p>
  </StyledFindUs>
);

export default FindUs;
