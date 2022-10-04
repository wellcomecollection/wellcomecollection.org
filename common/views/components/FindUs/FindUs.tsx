import { FC } from 'react';
import {
  wellcomeCollectionGallery,
  wellcomeCollectionAddress,
} from '@weco/common/data/organization';
import Space from '@weco/common/views/components/styled/Space';
import { prismicPageIds } from '@weco/common/data/hardcoded-ids';

const FindUs: FC = () => (
  <>
    <Space v={{ size: 'm', properties: ['margin-bottom'] }} as="p">
      <a href={wellcomeCollectionAddress.addressMap} className="plain-link">
        <span className="block">{wellcomeCollectionAddress.streetAddress}</span>
        {wellcomeCollectionAddress.addressLocality}{' '}
        {wellcomeCollectionAddress.postalCode}
      </a>
    </Space>
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
  </>
);

export default FindUs;
