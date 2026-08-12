import { NextPage } from 'next';

import PageLayout from '@weco/common/views/layouts/PageLayout';
import type { ArchiveType } from '@weco/content/services/wellcome/catalogue/archiveTypes';
import CollectionsHeader from '@weco/content/views/components/CollectionsHeader';

import ArchiveTypesList from './archives.ArchiveTypesList';

export type Props = {
  archiveTypes: ArchiveType[];
};

const ArchivesPage: NextPage<Props> = ({ archiveTypes }) => {
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
      <ArchiveTypesList archiveTypes={archiveTypes} />
    </PageLayout>
  );
};

export default ArchivesPage;
