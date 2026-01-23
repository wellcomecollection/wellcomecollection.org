import { NextPage } from 'next';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/layouts/PageLayout';

export type Props = {
  apiToolbarLinks: ApiToolbarLink[];
};

const CollectionsPeoplePage: NextPage<Props> = ({ apiToolbarLinks }) => {
  return (
    <PageLayout
      title="People and organisations" // TODO confirm
      description={pageDescriptions.collections.peopleAndOrganizations}
      url={{ pathname: '/collections/people-and-organisations' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection="collections"
      apiToolbarLinks={apiToolbarLinks}
    >
      <PageHeader variant="landing" title="People and organisations" />
    </PageLayout>
  );
};

export default CollectionsPeoplePage;
