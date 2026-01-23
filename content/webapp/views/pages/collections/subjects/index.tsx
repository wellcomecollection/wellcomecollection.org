import { NextPage } from 'next';

import { pageDescriptions } from '@weco/common/data/microcopy';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/layouts/PageLayout';

export type Props = {
  apiToolbarLinks: ApiToolbarLink[];
};

const CollectionsSubjectsPage: NextPage<Props> = ({ apiToolbarLinks }) => {
  return (
    <PageLayout
      title="Subjects" // TODO confirm
      description={pageDescriptions.collections.subjects}
      url={{ pathname: '/collections/subjects' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection="collections"
      apiToolbarLinks={apiToolbarLinks}
    >
      <PageHeader variant="landing" title="Subjects" />
    </PageLayout>
  );
};

export default CollectionsSubjectsPage;
