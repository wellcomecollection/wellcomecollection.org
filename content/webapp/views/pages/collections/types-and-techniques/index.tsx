import { NextPage } from 'next';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/layouts/PageLayout';

export type Props = {
  apiToolbarLinks: ApiToolbarLink[];
};

const CollectionsTypesPage: NextPage<Props> = ({ apiToolbarLinks }) => {
  return (
    <PageLayout
      title="Types and techniques" // TODO confirm
      description={pageDescriptions.collections.typesAndTechniques}
      url={{ pathname: '/collections/types-and-techniques' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection="collections"
      apiToolbarLinks={apiToolbarLinks}
    >
      <PageHeader variant="landing" title="Types and techniques" />
    </PageLayout>
  );
};

export default CollectionsTypesPage;
