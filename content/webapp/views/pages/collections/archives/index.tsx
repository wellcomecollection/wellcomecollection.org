import { NextPage } from 'next';

import PageLayout from '@weco/common/views/layouts/PageLayout';
import CollectionsHeader from '@weco/content/views/components/CollectionsHeader';

export type Props = Record<string, never>;

const ArchivesPage: NextPage<Props> = () => {
  return (
    <PageLayout
      title="Archives"
      description="Browse the archives held by Wellcome Collection."
      url={{ pathname: '/collections/archives' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      headerProps={{ hasColorBackground: true }}
      hideNewsletterPromo
      clipOverflowX
    >
      <CollectionsHeader
        title="Archives"
        introText="Original records created by individuals and organisations."
      />
    </PageLayout>
  );
};

export default ArchivesPage;
