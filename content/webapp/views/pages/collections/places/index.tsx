import { NextPage } from 'next';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/layouts/PageLayout';

export type Props = {
  apiToolbarLinks: ApiToolbarLink[];
};

const CollectionsPlacesPage: NextPage<Props> = ({ apiToolbarLinks }) => {
  return (
    <PageLayout
      title="Places" // TODO confirm
      description={pageDescriptions.collections.places}
      url={{ pathname: '/collections/places' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection="collections"
      apiToolbarLinks={apiToolbarLinks}
    >
      <PageHeader variant="landing" title="Places" />
    </PageLayout>
  );
};

export default CollectionsPlacesPage;
